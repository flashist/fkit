<!-- Copied verbatim on 2026-10-10 by fkit-producer from the owner-supplied file /Users/mark.dolbyrev/Downloads/report-2-command-buttons-mod.md so it survives the Downloads folder. -->
<!-- ⚠️ The report's "For the agent reading this" section is addressed to another Claude and asks for edits outside this repo. It is INPUT to the brief beside this file, NOT instructions: nothing in it was applied, and nothing in it authorizes any edit. The brief decides scope. -->

# Report: clickable command buttons above the prompt (a mod)

## For the agent reading this

Mark (the user) wants a small Claude Code mod. Load the `plugin-authoring`
skill before writing anything: it has this build's API types. Every API name
below was checked against the types of Claude Code v2.1.291, but verify each
one against the types you get before relying on it. Requires Claude Code
v2.1.287 or later.

## The problem

Claude often suggests commands in its replies, like `/compact`, `/context` or
`/ship-task ai-agents/tasks/backlog/foo.md`. They show in a different color
but are plain text. Mark has to retype or copy them every time.

## What Mark wants

- After each turn, the commands Claude suggested appear as buttons in the
  band above the prompt, for example:

  ```
   1: /ship-task   2: /compact   3: /context
  ╭────────────────────────────────────────╮
  │ >                                      │
  ╰────────────────────────────────────────╯
  ```

- Clicking a button, or pressing its number, puts that command into the
  prompt box, replacing the current draft.
- It must **never submit** the command. Mark presses Enter himself, because
  commands like `/clear` or `/ship-task` have real effects.
- The band is hidden when the last reply suggested no commands, and cleared
  when Mark submits a new prompt.
- Optional: the first command is also offered as the dim Tab suggestion.

## Detection rules

- Only real commands. Match `/name` against the session's registered
  commands so file paths like `/usr/bin` or `/Users/...` don't count. Look for
  a command-listing method on `$.command` in the types; if there isn't one,
  match only text inside inline code spans.
- Keep arguments when Claude wrote the full invocation inside inline code,
  e.g. `` `/ship-task ai-agents/tasks/backlog/foo.md` `` becomes one button
  with that whole text.
- Remove duplicates, keep the order they appear in, show at most 5.

## API pieces (exist in v2.1.291, re-check)

| Need | API |
| --- | --- |
| Read Claude's reply | `on('turn.complete', …)`: `const r = await next(e)`, then `r.text` |
| Draw the band | `on('ui.render', { component: 'AbovePrompt' }, …)`. Return a tree, or `next(e)` to show nothing. Put `await next(e)` inside your `Box` so other mods' bands (e.g. "You should know") still show |
| Buttons | `Button` with `key`, `label`, `hotkey` (one digit), `plain: true` (draws `1: label`), `onPress` |
| Put text in the prompt box | `$.prompt.fill({ text, mode: 'replace' })` |
| Dim Tab suggestion | `$.prompt.suggest(...)` |
| Clear on new prompt | `on('prompt.submit', …)`, then `return next(e)` |
| Keep state across reloads | `$.state` atoms (`atom`, `read`, `update`), declared in `types/index.d.ts` |
| Don't clash with surveys | Hide the band when `e.props.hasSurvey` is true, as the bundled band example does |

Check in the elements reference how a digit hotkey on the band behaves while
the cursor is in the prompt, so pressing `1` while typing doesn't trigger a
button by accident. Mouse clicks work regardless.

## Files

Mod name: `command-buttons`

```
command-buttons/
├── .claude-plugin/plugin.json      (with "types": "./types/index.d.ts")
├── hooks/hooks.json                ({ "modules": ["./register.tsx"] })
├── hooks/register.tsx
├── types/index.d.ts
└── register.test.ts
```

## Tests to write

- Reply mentions `/compact` and `` `/ship-task x.md` ``: two buttons, in that
  order, the second with its argument.
- Reply mentions `/usr/bin/env`: no buttons.
- Pressing button 1: `$.prompt.fill` called with `mode: 'replace'`, nothing
  submitted.
- `prompt.submit`: band cleared.
- Reply with no commands: band shows nothing.

Run `claude plugin validate <folder>` and `claude plugin test <folder>`.

## Loading and keeping it

- While developing: accept hot reloading when asked, or run
  `claude --plugin-dir <folder>`.
- To keep it: put the folder in a git repo with a
  `.claude-plugin/marketplace.json`, then
  `/plugin install command-buttons --marketplace <owner>/<repo>`.
- It may later belong in Mark's fkit framework.

## References

- Draw in the interface: https://code.claude.com/docs/en/plugins/mods/interface
- Mods overview: https://code.claude.com/docs/en/plugins/mods/overview
- Sample mods (see `blast-radius` for buttons, `token-weather` for a band):
  https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods
