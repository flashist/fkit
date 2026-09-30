# Design addendum: enforcing fkit's two write rules when agents use aiboard's CLI for everything

> ## ⛔ SUPERSEDED 2026-09-30 by the owner's FULL-MERGE ruling — dated note; nothing below it was changed
>
> The owner ruled (selected option text): *"No, fkit only → full merge — aiboard becomes fkit's built-in
> board; its repo is archived (history can be carried over). Simplest overall."* The decision now lives in
> [`2026-09-30-decision-document-merge-aiboard-into-fkit.md`](2026-09-30-decision-document-merge-aiboard-into-fkit.md).
> Read that first. This report stays on file as supporting evidence; where the two differ, the decision
> document wins.

- **Date:** 2026-09-30
- **Author:** `fkit-architect`, spawned by `fkit-lead` (consult, hop 1). No owner channel (ADR-021).
- **Kind:** design addendum — design only. No hook written, no settings changed.
- **Status:** ⏸ **OPEN — input to the decision document.**
- **Parent:** [`2026-09-30-eval-aiboard-as-fkits-single-task-store.md`](2026-09-30-eval-aiboard-as-fkits-single-task-store.md)
  — this **replaces its §5.1–§5.2 on the choice of door** and leaves the rest standing.

**The ruling this designs for — SELECTED OPTION TEXT, not his prose (2026-09-30):** *"CLI for everything —
Simpler, but harder for fkit's hook to check reliably."* ⚠️ The parent report recommended MCP; this ruling
went the other way. This document takes the ruling as given and states honestly what it costs.

**Tags:** **[M]** read in fkit today · **[S]** read in aiboard's source at HEAD `0108027` · **[AL]**
`aiboard-lead`'s input, 2026-09-30.

---

## 0. The answer in plain words

- fkit **can** check the ordinary case: an agent typing `aiboard task move 0404 done …` in the terminal
  tool. A new hook reads the command before it runs and refuses it unless the caller is the producer.
- fkit **cannot** check every way of saying the same thing. A shell is a full programming language;
  there are many spellings of one command, and some ways to close a task never mention aiboard at all
  (the plainest: `mv` the folder into `done/`, because **the folder is the status**).
- **Compared with MCP: weaker on the normal path, the same on the back doors.** With MCP, the allowed
  way to close is checked exactly; with the CLI it is checked by reading text, which can be fooled or can
  misfire. The back doors (moving folders, editing files, scripts, Codex, plain `claude` sessions) are
  open under **both** designs.
- **That matches what fkit has always claimed, and no more:** producer-only closes are *"separation of
  invoking identity, never prevention"* (ADR-033 §"The limit"; ADR-050 D2). They stop honest mistakes by
  cooperating agents; they never stopped a determined one.
- **Made nearly as good as MCP for honest mistakes** by one design choice: a *strict* hook that refuses
  **any** aiboard command it cannot read with certainty (§3). Plus **detection after the fact**: a task in
  `done/` with no close record gets flagged (§5).

---

## 1. The two rules to enforce

1. **Only the producer may close or cancel** a task or sprint (ADR-033), and a spawned producer's close is
   always marked `agent` (ADR-033 §5).
2. **Agents never hand-edit aiboard's front matter** (`aiboard-lead`'s non-negotiable [AL]; parent report
   §5.2). Brief **bodies** may still be edited.

## 2. What the hook can see

A Claude Code `PreToolUse` hook on the `Bash` tool receives the command **as one string**, plus the real
caller's `agent_type` at any spawn depth — the same identity field the skill-ownership hook already uses
(ADR-018 §4; `claude/skill-ownership-hook.sh`). It is registered like the other five hooks in
`build_settings()` (`claude/fkit-claude.sh:295-331` [M]).

It sees **text**, not meaning. It does not see what a script file contains, what a variable holds, or what
a program started by the command does next.

⚠️ This is the mechanism ADR-050 **declined** for the mover command: *"B-2 … argv matching is a string game,
and ADR-036's declared-site inventory would grow a site that is easy to drift."* Under "CLI for everything"
it is no longer optional — the CLI **is** the sanctioned door. **The new ADR must record that ADR-050's B-2
rejection is overtaken by this ruling**, not silently reversed.

## 3. The hook, designed (no code)

### 3.1 What counts as "an aiboard write that closes"

From aiboard's CLI [S `aiboard/cli.py`]:

| Route to a closed state | Spelling today |
|---|---|
| Change status | `task change-status` · aliases **`status`**, **`move`** (`cli.py:417`) |
| Create already closed | `task new … --status done` (`cli.py:389`) |
| Sprint close | `sprint change-status` · aliases `status`, `move` (`cli.py:504`) |
| Status words meaning done | `done`, **`closed`, `complete`, `completed`** (`model.py:30-44`) |
| … meaning cancelled | `cancelled`, **`canceled`, `cancel`** |
| Option spelling | Python's argument parser accepts **shortened long options** by default (`--stat` for `--status`); the Node rewrite may or may not. **`--json` and `--root` may appear anywhere.** |
| Run a web server and write through it | `aiboard serve` (and the planned `serve --owner` — which would stamp the write **as the owner's**) |
| Talk MCP by hand | `aiboard mcp` fed JSON on stdin |

⭐ **Requirement on aiboard (R23):** `aiboard info --json` lists its own subcommands, aliases and status
words, so the hook reads the vocabulary from the pinned aiboard instead of keeping its own copy that can
drift. The version lock ([`2026-09-30-design-fkit-aiboard-version-lock.md`](2026-09-30-design-fkit-aiboard-version-lock.md))
guarantees the list matches the aiboard actually run.

### 3.2 The strict rule — refuse what it cannot read

```
PreToolUse  matcher: Bash
  tokenize the command with a small POSIX-shell lexer (quotes, escapes, ; && || | & newlines, $( ), ` `)
  find every command whose program is aiboard — by name, by path (…/aiboard), via npx/node/python -m,
    or via env/exec/nohup/xargs wrappers
  if none, and the text does not mention "aiboard" at all → allow (fast path; nearly every command)
  if "aiboard" appears but the lexer cannot account for it
       (inside sh -c / bash -c / eval / python -c / node -e / a here-doc / $VAR / $( ) / backticks)
       → DENY: "fkit reads aiboard calls only as plain single commands — run it directly"
  for each plain aiboard command:
     serve, mcp                      → DENY for every agent (the owner starts the page himself)
     a write without an explicit --by → DENY ("say who you are: --by fkit-<role>")
     --by ≠ fkit-<real role>          → DENY (attribution is checked, not trusted)
     a closing route (§3.1) and role ≠ producer → DENY
     a move OUT of done/cancelled and role ≠ producer → DENY (re-opening is a lifecycle act too)
     otherwise → allow
  any inline AIBOARD_AUTHOR=… assignment → DENY
```

- ⚠️ **Precondition:** today `sprint change-status`, `task edit`, `task rank` and `sprint add/remove` take
  **no `--by`** and record no author [S `cli.py:504-507`; parent report R17]. Until aiboard adds `--by` to
  every write, the "explicit `--by`" rule would refuse every sprint close. **R17 is therefore a hard
  requirement under the CLI door**, not a nice-to-have.
- **Why "refuse what it cannot read":** a permissive hook (match the obvious form, allow the rest) is
  fooled by the first `bash -c`. A strict one turns every unusual spelling into a refusal with a clear
  message. Honest agents then simply use the plain form. This is what brings the normal path close to MCP
  **for honest mistakes**.
- **Its cost — false refusals:** e.g. `grep -n "aiboard task move" notes.md` mentions aiboard inside a
  quoted string. The lexer handles plain quoted arguments to a non-aiboard program (allowed); the refusal
  applies only where the lexer truly cannot tell. Some friction remains and should be measured in the
  spike.
- **Marker honesty (rule 1's second half):** whether the close is `agent` or `owner-verified` is the
  producer skill's decision. The hook can additionally refuse `--close owner-verified` from a **spawned**
  producer — ⚠️ provided the payload carries a reliable "spawned" signal; to verify in the spike (parent
  report F3).
- **Fail-open or fail-closed on a parse fault** (the hook itself crashes, `node` missing): the carry-check
  hook fails **open** by owner ruling (`claude/carry-check-hook.sh:20-27` [M]). This hook guards the task
  lifecycle; **recommend fail-closed for aiboard-mentioning commands only** → owner question Q-C2.

### 3.3 Rule 2 — no hand edits of front matter

- **`Edit` / `MultiEdit` / `Write`** (structured payloads — reliable): refuse when the change touches the
  front-matter block (between the opening and closing `---`) of `ai-agents/tasks/**/brief.md` or
  `ai-agents/sprints/**/sprint.md`. For `Edit`, the hook reads the file and checks whether `old_string`
  falls inside that block; for `Write`, it compares the block before and after. Body edits pass.
- **`Bash`** (text — unreliable): refuse commands that combine a file-changing program (`mv`, `git mv`,
  `cp`, `rm`, `sed -i`, `perl -pi`, `>`/`>>` redirection, `tee`) with a path under `ai-agents/tasks/` or
  `ai-agents/sprints/`. ⚠️ **This will refuse legitimate work** (a coder writing `plan.md` with a
  redirection) — so it must be narrowed to front-matter files and folder moves, and even then it is a
  tripwire, not a wall.

## 4. The bypass routes — honestly

| # | Route | Seen by the hook? | Can it be closed? |
|---|---|---|---|
| 1 | Plain `aiboard task move 0404 done --by …` | ✅ | ✅ checked |
| 2 | Alias spellings (`status`, `move`, `closed`, `completed`, `canceled`, shortened options, `--json` anywhere) | ✅ | ✅ if the vocabulary comes from `info --json` (R23) |
| 3 | `sh -c "…"`, `bash -c`, `eval`, `$(…)`, backticks, variables (`S=done; aiboard … $S`) | text visible, meaning not | ✅ **by refusal** — strict rule denies any aiboard mention it cannot read |
| 4 | Other runtimes: `python3 -c`, `node -e`, `npx aiboard`, full path, a `Board` library import | text visible if "aiboard" appears | ✅ by refusal when "aiboard" appears; ❌ if the string is assembled (`"aib"+"oard"`) |
| 5 | **Write a script file, then run it** (`bash /tmp/x.sh`, a Makefile target, an npm script) | the run is visible, the file's contents are not | ⚠️ partly — the `Write` of the script can be checked for the word "aiboard", but obfuscation defeats it |
| 6 | **Move the folder by hand** (`mv tasks/in-progress/0404-x tasks/done/`) — **the folder is the status** | text visible | ⚠️ tripwire for plain forms (§3.3); ❌ not for indirect forms. **The biggest gap — needs no aiboard at all.** |
| 7 | Edit front matter by hand | ✅ for Edit/Write; text for Bash | ✅ for Edit/Write (§3.3); ⚠️ Bash |
| 8 | Environment tricks (`AIBOARD_AUTHOR`, `AIBOARD_ROOT` pointing elsewhere) | text visible if inline | ✅ inline; ❌ if set in a script |
| 9 | Start `aiboard serve [--owner]` and `curl` it | ✅ | ✅ `serve` refused for agents; ❌ if the owner's page is already running, a `curl` to it is just an HTTP request (refusable by text only) |
| 10 | **Codex** (`codex exec …`) runs its own commands, which Claude's hooks never see | only the outer `codex exec` | ✅ today by fkit's `--sandbox read-only` (`fkit-review/SKILL.md:62`); ⚠️ would open if that ever changes |
| 11 | A plain `claude` session (not started by `fkit`) | ❌ no fkit hooks at all | ❌ (same for every fkit hook today) |
| 12 | The owner's own terminal | not an agent | — his CLI writes are recorded `channel: cli`, **not** owner-verified |

**What cannot be closed off, in one line:** anything that reaches the files without writing the word
"aiboard" in a form the hook can read — above all, **moving a task folder** (row 6).

## 5. The backstop that does work — detection

Prevention by reading text has a ceiling. Detection does not depend on how the change was made:

- **Every close made through aiboard carries a close record** (`closed_by`, `channel`, `close`) — parent
  report R5.
- **A task in `done/` or `cancelled/` with no close record, or whose last status line is not a close**,
  was moved by hand. **`aiboard check` reports it; `fkit-status` surfaces it** as a drift item the owner
  sees (the way ADR-029 chose detection over locks for the id race).
- **Requirement on aiboard (R24):** `check` flags a closed task without a close record, and a close record
  whose `channel` is impossible for its `closed_by`.

This catches rows 5, 6, 8 and 11 after the fact — which none of the prevention layers can.

## 6. Should aiboard record the door for CLI calls?

**Yes — automatically, and not settable by the caller.** aiboard knows which of its own doors a write came
through (CLI, MCP, web, owner door). Recording `channel: cli` costs nothing and lets the owner see at a
glance that a close arrived through the terminal, not his page. What it does **not** tell you is *who*
typed it — `--by` is still a claim, checked only by the hook, and only for the plain form (§3.2).
(**R25**: `channel` is set by aiboard from the door, never from an argument.)

## 7. Compared with MCP — the honest verdict

| | MCP door (parent report's recommendation) | CLI door (ruled) |
|---|---|---|
| The allowed way to close is checked | **exactly** — tool name + structured arguments | **by reading text** — reliable only with the strict rule; some false refusals |
| Attribution (`by` vs real role) | checked exactly | checked for plain commands only |
| Can fkit forbid the CLI altogether for agents? | ✅ yes — one simple rule, "no Bash mentioning aiboard", with no legitimate use to protect | ❌ no — the CLI is the legitimate way |
| Back doors (mv, file edits, scripts, Codex, plain `claude`) | open | open — **the same** |
| Detection (§5) | works | works |

**Plainly: the CLI door is materially weaker than MCP on the normal path** — the path every honest agent
takes — because the check becomes text-reading instead of a structured check. **On the back doors the two
are equal**, because neither design closes them.

**What it would take to reach parity:**

1. **For honest mistakes — nearly there** with the strict rule (§3.2) + the vocabulary from `info --json`
   (R23) + detection (§5). Cost: a hand-written shell lexer (zero dependencies, ADR-014) and its tests,
   plus some friction from false refusals. Size **M**.
2. **Full parity on the one sensitive act** — a hybrid: **status changes to done/cancelled go through a
   single MCP tool; everything else stays CLI.** Then the close is checked exactly and the hook can refuse
   any CLI close outright. Cost: one MCP registration per session. ⚠️ This revisits the owner's ruling on
   one operation, so it is a **question**, not a recommendation to override (Q-C1).
3. **Beyond parity (unforgeable)** — not available in either design: agents and owner share one OS user
   (ADR-049).

## 8. Residual risk, in plain words

An agent that follows the rules will be stopped if it tries to close a task it should not, or signs as
someone else. An agent that tries to get around the rules can — most simply by moving the task's folder by
hand — but it will **show up afterwards** as a close with no record, on the next status check. The owner's
page is the only door that counts as him, and even that is a label, not proof. This is the same promise
fkit makes today, now with a check at the write itself for the plain case and a detector behind it.

## 9. What changes elsewhere

- **Parent report R16** (per-call MCP author) → becomes **"every CLI write takes an explicit `--by`"**;
  aiboard already supports `--by` [S].
- **New aiboard requirements:** R23 (vocabulary in `info --json`), R24 (`check` flags closes without a
  record), R25 (`channel` set by aiboard from the door).
- **New ADR** must say: CLI is the agents' door; the Bash hook exists and fails closed/open per Q-C2;
  ADR-050's B-2 rejection is overtaken; detection (§5) is part of the enforcement story; ADR-033's "The
  limit" is inherited.
- **Tests:** a fixture corpus of commands — plain, aliased, wrapped, obfuscated — each with its expected
  allow/deny, is the hook's specification (like `test/skill-ownership-hook.test.js` for the Skill hook).

## 10. Open questions for the owner

| # | Question | Recommended answer |
|---|---|---|
| **Q-C1** | Closing is the one act where the difference matters. Keep "CLI for everything", or let **only closes and cancels** go through one checked MCP tool? | **Your call — the hybrid gives exact checking of closes for one extra registration.** If simplicity wins, CLI-only with the strict rule is acceptable for honest mistakes. |
| **Q-C2** | If the new hook itself fails (crash, `node` missing), should aiboard commands be **refused** or **allowed with a warning**? | **Refused** — for commands mentioning aiboard only; every other command unaffected. |
| **Q-C3** | Accept some false refusals (the hook says "run it as a plain command") as the price of the strict rule? | **Yes.** |
| **Q-C4** | Add the Bash tripwire for hand folder moves under `ai-agents/tasks/` (§3.3), knowing it can refuse legitimate commands? | **Yes, narrowed to folder moves and front-matter files**, with detection (§5) as the real backstop. |
