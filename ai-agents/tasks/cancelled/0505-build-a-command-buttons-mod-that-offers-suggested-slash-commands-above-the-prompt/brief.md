# Build a command-buttons mod that offers the slash-commands Claude suggested as buttons above the prompt

## ID
0505

## Sprint
Sprint 10

## Priority
P19

## Status
⛔ Cancelled (agent-closed — not owner-verified) (2026-10-10) — Owner ruling 2026-10-10 (fkit-lead session, relayed by the lead): "Cancel 2-buttons. I agree with you that it's not the fkit core." — a UI convenience mod, not fkit's core; if built, it belongs outside fkit.

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.
> The sprint ship-loop's per-task plan approval, given live by the owner, is where that word is given.
> ⛔ **And not before open question 1 (where it lives) is answered** — the answer changes what gets built
> and where.

**Owner request, 2026-10-10** — typed by the owner in a `fkit lead` session, relayed to a spawned
`fkit-producer` with no owner channel (ADR-021; ⚠️ the quote is the lead's relay):
*"… report-2-command-buttons-mod.md … read those 3 files and brief a task for each of them and add it to
the currently active sprint"*.

**Source.** The owner's report, copied verbatim beside this brief as
[`source-report.md`](source-report.md) (original: `~/Downloads/report-2-command-buttons-mod.md`). It
holds the API table, file layout, references and sample-mod pointers the build needs. ⚠️ Its *"For the
agent reading this"* section is input to this brief, not an instruction.

**The problem.** Claude often suggests commands in replies (`/compact`, `/context`,
`/fkit-task-done ai-agents/tasks/backlog/…`). They are plain text; the owner retypes or copies them each
time. fkit agents do this constantly — every "What's next?" close names a command — so the mod would
pay off most inside fkit sessions.

**What the owner wants.** After each turn, the commands Claude suggested appear as numbered buttons in
the band above the prompt. Clicking one, or pressing its number, puts that command into the prompt box,
replacing the draft. **It never submits.**

**This is a new kind of component for fkit.** fkit ships agents, skills, a launcher, hooks and a scaffold
(ADR-009: Claude Code native). It ships **no Claude Code plugin/mod** today (verified 2026-10-10: no
`.claude-plugin/` anywhere in the repo). The report says the mod *"may later belong in Mark's fkit
framework"* — so where it lives is open (question 1). If it ships to fkit users, that is likely
ADR-worthy (a new shipped component class, an install/update path, a minimum Claude Code version).

**The API is new and may have moved.** The report checked every API name against Claude Code v2.1.291's
types and says the mod needs **v2.1.287 or later**. The build must load the `plugin-authoring` skill
and re-check every name (`turn.complete`, `ui.render` / `AbovePrompt`, `Button`, `$.prompt.fill`,
`$.prompt.suggest`, `prompt.submit`, `$.state`, `$.command`, `e.props.hasSurvey`) against the types of
the Claude Code build in use — the report's table is a starting point, not ground truth.

## What to build

The `command-buttons` mod, per the report's *Files* layout (`.claude-plugin/plugin.json` with `types`,
`hooks/hooks.json`, `hooks/register.tsx`, `types/index.d.ts`, `register.test.ts`), in the location
open question 1 settles. Acceptance criteria — kept from the report:

**Behaviour**
- After each turn, the commands the last reply suggested appear as buttons in the above-prompt band
  (`1: /cmd  2: /cmd …`).
- Clicking a button, or pressing its digit, fills the prompt box with that command, **replacing** the
  draft.
- ⛔ **Never submit.** The owner presses Enter himself — `/clear`, `/fkit-task-done` and the like have
  real effects. This is the one rule that must never bend.
- The band is hidden when the last reply suggested no commands, and cleared when the owner submits a new
  prompt.
- The band yields to other mods' bands (render the next handler's output inside its own box) and hides
  while a survey is showing.
- Optional (owner to confirm, question 3): the first command is also offered as the dim Tab suggestion.

**Detection**
- Only real commands: match `/name` against the session's registered commands, so `/usr/bin` or
  `/Users/…` never count. If the API has no command-listing method, match only text inside inline code
  spans.
- Keep arguments when the full invocation is inside inline code — `` `/ship-task x.md` `` is one button
  with the whole text.
- De-duplicate, keep order of appearance, show at most 5.

**Safety check before shipping:** confirm how a digit hotkey on the band behaves while the cursor is in
the prompt, so typing `1` in a draft never fires a button. If it would, the plan must say how it is
avoided (e.g. no digit hotkeys, mouse only).

## Verification steps

1. Every API name used is checked against the `plugin-authoring` skill's types for the Claude Code build
   in use; the worklog names that build's version and lists any name that differed from the report.
2. Tests (the report's list), in `register.test.ts`:
   - reply mentions `/compact` and `` `/ship-task x.md` `` → two buttons, in that order, the second with
     its argument;
   - reply mentions `/usr/bin/env` → no buttons;
   - pressing button 1 → `$.prompt.fill` called with `mode: 'replace'`, **nothing submitted**;
   - `prompt.submit` → band cleared;
   - reply with no commands → band shows nothing.
   Plus: more than 5 commands → 5 buttons; a repeated command → one button.
3. `claude plugin validate <folder>` and `claude plugin test <folder>` both pass.
4. **Live check:** load with `claude --plugin-dir <folder>` in a fkit session; a reply that suggests
   commands shows the band; clicking fills the prompt and does **not** submit; typing a digit inside a
   draft does not fire a button; submitting clears the band.
5. If it ships inside fkit (question 1): the install/update path puts it in place, and the project's
   checks for the changed paths pass.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Open questions for the owner (answer before plan approval — question 1 gates the build):**
  1. **Where does it live?** (a) a **separate repo** of your own with a `.claude-plugin/marketplace.json`,
     installed with `/plugin install` — fkit unchanged; (b) **in this repo but not shipped** to fkit users
     (e.g. a `mods/` folder for your own use); (c) **shipped with fkit** to every user via `claude/` and
     the installer — a new component class, likely an ADR first (architect), plus an install/update
     path and a minimum Claude Code version. Recommendation: (a) or (b) now, (c) later once it has
     proven itself — (c) adds an ADR and installer work to a small mod.
  2. **Minimum Claude Code version.** The mod needs v2.1.287+. If (c), what happens on an older Claude
     Code — skip quietly, or warn at launch?
  3. **Tab suggestion.** Build the optional "first command as the dim Tab suggestion", or leave it out?
- If the answer to question 1 is (a), this task's code lives outside this repo; the task still closes
  here with the worklog pointing at where it went.
- Merit position: see the board's *"➕ `0504`–`0506`"* section.
