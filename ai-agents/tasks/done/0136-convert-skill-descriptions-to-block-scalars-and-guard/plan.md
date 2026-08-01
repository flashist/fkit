# 0136 — Implementation plan (owner-approved 2026-08-01)

Approved by the owner via `AskUserQuestion` in the live `fkit lead` session driving
`/fkit-sprint-ship-loop`, then handed to this Build worker under the loop's declared-approval marker.
Reproduced here as approved; the worklog records what actually happened against it.

## Owner rulings taken before the build started

1. **WRAP the descriptions** across indented continuation lines — not one long line. The coder's
   argument was accepted: a `>-` scalar holding a single unwrapped line makes the "every continuation
   line is indented past the key" clause **vacuous**, because there are no continuation lines to
   check. Wrapping is what gives the guard something to guard.
2. **Ship with brief verification step 5 (the live-loader eyeball) reported as an OUTSTANDING
   residual.** Do not block on it. Capture the baseline so it is dischargeable, and flag it loudly in
   the worklog — it must not read as verified.

## 0. Baseline (before touching anything)

**0a. Establish a green suite baseline.** The working tree is **not clean** — sibling sprint tasks
have left `AGENTS.md`, `CLAUDE.md`, `claude/fkit-claude-init.sh`, `claude/scaffold/universal-rules.md`,
`test/rules-block-budget.test.js`, `ai-agents/sprints/sprint-2.md` and this brief modified, plus 0130
moved to `done/`. Run `npm test` (unit + `prove-red.sh`) **first** and record the result. Without
this, a pre-existing red from a sibling task gets misattributed to 0136. If it is already red, stop
and report — do not build on an unknown baseline.

**0b. Capture the rendered-description baseline (the "before" side of verification step 2).** The
whole `claude/skills/` tree is **clean at HEAD** (re-verified), so the baseline comes from git and is
immune to my own edits: `git show HEAD:claude/skills/<name>/SKILL.md`. For each of the 25, extract the
description with a **plain-scalar** reader (drop the `description:` key, `trim()` each continuation
line, join with a single space) and write `name<TAB>value` to `desc-before.tsv` **in the scratchpad,
not the repo**. This throwaway migration/compare script is never committed — a one-shot tool, not test
coverage.

**0c. Capture the live-loader baseline (the "before" side of verification step 5).** The build
session's own injected skill listing renders all 25 descriptions as the live loader parses them
**today**. Save that text to the scratchpad as `listing-before.txt`. It doubles as proof the loader
currently parses all 25 correctly — including the three same-line-colon files and the one multi-line
one.

## 1. Convert the 25 `claude/skills/*/SKILL.md` descriptions (binding: this comes first)

Target shape — structurally identical to `claude/agents/fkit-coder.md:3-8`:

```yaml
---
name: fkit-<skill>
description: >-
  First line of the description, wrapped at ~100 display columns,
  every continuation line indented exactly two spaces.
---
```

Rules, all mechanically checkable: indent **exactly 2 spaces** on every continuation line, uniform —
never deeper on one line. **No blank lines** inside the scalar. **No trailing whitespace.** **No
tabs.** Break lines **only at an existing single space**; never mid-word, never at a run of spaces.
**Do not reword, re-punctuate, or "tidy" any description** — structure only.

Scope: 25 files. 24 single-line today; **one** — `claude/skills/fkit-sprint-ship-loop/SKILL.md` — is
already a 3-continuation-line plain scalar at uniform 2-space indent, so its conversion is inserting
`>-` after the key and indenting the first content line. Lowest-risk of the 25, not highest, despite
being the file 0123 broke.

**Not dual-homed — re-confirmed.** `claude/scaffold/` has no skill tree. Edit `claude/skills/` only.
`.claude/skills/` is the gitignored refresh mirror, handled in step 7.

**Fold semantics this step must respect:** a `>-` scalar takes base indent from the first non-empty
content line; folds a break between two lines at base indent into **one space**; treats a **more**-
indented line as a more-indented line and **preserves its newline** (an accidental extra space
silently makes the description multi-line); turns a **blank line** into a newline; **ends the scalar**
at any line indented **less** than base (the brief's named hazard, the one thing a block scalar does
not absorb); `-` chomping strips the trailing newline.

## 2. Prove the rendered text did not change — before writing any guard

Comparison method (state verbatim in the worklog): (1) `desc-before.tsv` from 0b — 25 descriptions
read from `HEAD` with a *plain-scalar* reader. (2) `desc-after.tsv` — the same 25 read from the
working tree with a **`>-` folding** reader. (3) `diff` must be **empty** — byte equality of all 25
values, not "looks the same". (4) On any mismatch print a character-index diff for that skill and
**fix the wrap, not the text**.

Two **independent implementations** read the two sides, and the `git show HEAD:` source makes the
baseline unforgeable by my own edits. Also run `git diff --stat claude/skills/` — expect exactly 25
files touched, every hunk confined to the frontmatter. A body-line change anywhere means an accidental
edit.

## 3. `test/skill-frontmatter.test.js` — the hand-rolled reader (only after step 2 is green)

**ADR-014 zero-devDeps: no YAML library.** `package.json` gains **no** `devDependencies`.

House-style header comment recording: why it exists (0123's silent failure, review R4/R5), that R5's
structural rule replaces colon-hunting, that it covers **frontmatter only and never skill behaviour**,
and that it is read-only over the repo with all fixtures under `os.tmpdir()`.

Pure functions, exported for testability (the `adr-number-uniqueness.test.js` pattern):

- `splitFrontmatter(text)` — line 1 must be exactly `---`; find the next line exactly `---`. Returns
  frontmatter lines or a reason string. **"First thing in the file"** means line 1 — a leading blank
  line or BOM is a violation.
- `findKey(fmLines, key)` — locate `name:` / `description:` at column 0 and collect continuation lines
  up to the next column-0 `key:` or the closing `---`. Deliberately **not** a general YAML parser.
- `foldBlockScalar(contLines)` — implements the `>-` semantics above.
- `auditFile(text)` — returns violation strings, one per broken rule: (1) no frontmatter / not first
  thing in file; (2) `name:` missing; (3) `description:` missing; (4) `description:` is **not** `>-`
  (`/^description:[ \t]*>-[ \t]*$/`) — *the structural rule*; (5) a continuation line **not indented
  more** than the `description:` key (scalar terminated early); (6) a continuation line uses a **tab**;
  (7) folded result **empty** or **not a single line**.
- `renderViolations()` as a separate named function so the failure **message** is assertable, not just
  the field (the R39 lesson from `adr-number-uniqueness.test.js`).

Unit tests over `os.tmpdir()` fixtures — good file passes, plus one test per violation, including the
two the brief names: **fixture A** `description: a plain scalar` → violation 4; **fixture B**
de-indented continuation line → violation 5. Plus more-indented line → 7, blank line inside scalar →
7, `description: >-` with nothing after → 7, tab indent → 6, missing `name:` → 2, leading blank line
before `---` → 1.

Live-corpus tests: **non-vacuity first** — assert `skills.length > 0` **and** `agents.length > 0`,
with a message saying the scan is vacuous rather than clean if the directories moved. Then `every
claude/skills/*/SKILL.md passes` → 25/25, and `every claude/agents/*.md passes` → 7/7 (pre-verified
all 7 already pass every clause).

New env seam `FKIT_FRONTMATTER_ROOT` (default `join(REPO, 'claude')`), following the `FKIT_LAUNCHER` /
`FKIT_SKILL_OWNERSHIP_HOOK` precedent, **including the stderr warning when non-default** — a stale
inherited value must be loud, or `npm test` silently audits some other tree and reports green.

## 4. `test/prove-red.sh` — prove the live-corpus assertion is load-bearing

- `run_frontmatter_suite() { FKIT_FRONTMATTER_ROOT="$1" node --test "$repo/test/skill-frontmatter.test.js" … }`
  — same green/red + `$out` contract as existing helpers.
- **`0g.` unmutated-copy-is-green** against `$(dirname "$clean_copy")`, reusing the existing
  `claude-clean` copy. **Mandatory** — without it a later red could be red-via-setup and prove nothing.
- **Mutation 8** — in a fresh `make_claude_copy`, `sed` one skill's `description: >-` + first content
  line back into a single-line **plain scalar** → suite must red **at the named live-corpus skills
  assertion**.
- **Mutation 9** — in another copy, **de-indent** a continuation line of
  `fkit-sprint-ship-loop/SKILL.md` to column 0 → red at the same named assertion, different violation.
- Both carry the **`cp … .orig` + `cmp -s` no-op guard** and fail the run loudly if the `sed` stopped
  matching. Not optional decoration: the file's own header records that mutation 1 was silently
  disarmed for a whole task once and `npm test` reported green over a dead gate.
- Both use `grep -Eq '(✖|not ok|fail).*<assertion name>'` so a red for the wrong reason is caught.

## 5. Run and record

`npm test` → `node --test test/*.test.js` green including the new file, then `bash test/prove-red.sh`
green. **Show the red run** per ADR-014: paste `prove-red.sh`'s output for mutations 8 and 9.

## 6. Agents

Expected to pass unchanged; pre-verified all 7 do. If anything unexpectedly fails, **stop and return
`NEEDS-DECISION`** — do not edit an agent file.

## 7. Refresh the `.claude/` mirrors

Run `claude/fkit-claude-init.sh .`, then `diff -r claude/skills/<n> .claude/skills/<n>` for all 25
(and the 7 agents, free) — every diff empty. `.claude/` is gitignored and is never the edit site.

## 8. Verification step 5 — the live-loader eyeball — CANNOT be completed in the building session

The listing is injected **at session start**, so this session shows the **pre-change** listing;
nothing re-reads it and no test substitutes for the loader. **Owner ruling: ship anyway, report it as
outstanding.** Capture `listing-before.txt` (step 0c) so it is dischargeable in a fresh session, and
flag it loudly in the worklog as UNVERIFIED. Do not describe it as done.

## 9. No commit

Leave everything in the working tree.

## Files touched

`claude/skills/*/SKILL.md` × 25 (frontmatter only); `test/skill-frontmatter.test.js` (new);
`test/prove-red.sh` (new helper, `0g`, mutations 8 and 9); `.claude/skills/`, `.claude/agents/`
(refreshed mirrors, gitignored). **Not touched:** `package.json`, `claude/agents/*.md`,
`claude/scaffold/`, any skill body.

## Risks

1. More-indented continuation line → literal newline, description silently multi-line; mitigated by
   uniform-indent rule + guard clause 7.
2. Wrap at a non-space → text changes silently; caught by step 2's byte comparison, and the
   double-space pre-scan came back clean.
3. Trailing whitespace on a folded line — forbidden by rule, flagged by the reader.
4. Dirty working tree from sibling tasks — mitigated by the 0a baseline and an explicit review scope.
5. Green test read as coverage of skill behaviour — the header comment says outright it is
   frontmatter-only.

## Stale brief claim, do not act on it

The brief's Notes warn that `fkit-task-ship-loop/SKILL.md` and `fkit-sprint-ship-loop/SKILL.md` carry
**uncommitted edits from tasks 0122 and 0123**. **This is no longer true** — verified at plan time,
`claude/skills/` is entirely clean at HEAD. No coordination is needed.
