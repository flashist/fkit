# Worklog — 0292: scope README:54's "fkit-managed structure" sentence

**Role:** `fkit-coder`, spawned as the Build worker of `/fkit-sprint-ship-loop`.
**Standing approval:** the owner approved `plan.md` live via `AskUserQuestion` in the driver's
`fkit lead` session on 2026-08-14 — verbatim option label **"Approve as planned (Recommended)"**,
which answered both open questions (**no reflow**, **§C6 wording verbatim**).

## What was done

Replaced `README.md:54-55` with the four-line §C6 wording from the approved plan. Nothing else.

- **Before** (2 lines, `:54-55`):
  ```
  A launch also tells you — one stderr line — when your project's fkit-managed structure diverges from
  what the installed version ships. To see the per-file verdicts and repair, run `/fkit-heal` in a
  ```
- **After** (4 lines, `:54-57`):
  ```
  A launch also tells you — one stderr line — when your project's `ai-agents/` tree, or its root
  `CLAUDE.md` / `AGENTS.md`, diverges from what the installed version ships. (The fkit agents and
  skills under `.claude/` are not part of that check: a launch rewrites them outright, so there is
  nothing to diverge.) To see the per-file verdicts and repair, run `/fkit-heal` in a
  ```

Old lines `:56-59` survive **byte-identical** at `:58-61`. Proven by `git diff -U0 -- README.md`
showing exactly two `-` lines and four `+` lines, with no `±` on any surrounding prose line.

No reflow of the rest of the paragraph, per the owner's answer to open question 1. The fourth new
line is 83 chars — the accepted cosmetic cost of leaving `:56-59` untouched.

## Disk re-check before editing

The plan's location claim was re-verified this turn, not trusted:
`grep -n "fkit-managed" README.md` → single hit, line 54. The two lines on disk matched the plan's
quotation byte-for-byte before the edit was applied.

## Decision log — autonomous fixes and obvious-winner calls

**none.**

No fix was applied without asking, and no obvious-winner call was made. The task was a single
verbatim-wording edit fully specified by the approved plan; nothing arose that required a judgment
call, so nothing was decided unattended. (Recorded explicitly so an empty log is distinguishable
from a forgotten one.)

## Not done — deliberately outside the surface

- No commit, no `git add`, no staging of `README.md`.
- No task-file move, no `## Status` change — a separate producer runs the close.
- `plan.md` not touched, re-authored, or overwritten.
- Nothing under `claude/`, `ai-agents/wiki-vault/`, or `ai-agents/knowledge-base/decisions/`.

## Residuals carried forward

Recorded, not fixed — all three are the plan's own out-of-scope findings:

1. The `fkit-managed` phrase survives outside the README, in the code the sentence describes —
   `claude/fkit-claude-init.sh:567-569` (gitignore comments) and `claude/fkit-claude.sh:393`
   (a comment reading "when the project's fkit-managed structure diverges"). Both files are on
   ADR-043 §C1's explicitly-unaffected list; the brief forbids touching them. The README fix does
   not retire the phrase repo-wide.
2. No `wiki-vault/` sweep for the same over-broad claim was performed — that lands on `0293`.
3. No other README defect was found **because no audit was run**. Absence of findings here is not a
   clean bill of health for the file.

## Honest limit on verification

**No test establishes that the new sentence is correct.** It is prose; nothing in `test/` reads the
root README's prose. Correctness rests entirely on the plan's disk measurements (the spec inventory
is 48 paths, exactly two outside `ai-agents/` — `CLAUDE.md` and `AGENTS.md`; `.claude/` appears
nowhere in the conformance surface; the launch refresh is an unconditional delete-and-recopy that
runs *before* the notice). `npm test` proves only that the edit broke nothing.
