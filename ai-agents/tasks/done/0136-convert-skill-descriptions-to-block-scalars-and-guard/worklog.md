# 0136 — Worklog

Built 2026-08-01 by the `fkit-sprint-ship-loop` **Build worker** (a spawned `fkit-coder`), under the
loop's declared-approval marker: the owner approved the plan via `AskUserQuestion` in the live lead
session before this worker was spawned. Plan reproduced in `plan.md`.

---

## ⚠️ OUTSTANDING — read this before treating the task as verified

**Brief verification step 5 — "the live skill listing renders all 25 descriptions correctly, eyeball
it" — is NOT DONE. It is UNVERIFIED, not passed.**

Why it cannot be done from the building session: the skill listing is injected into a session's
context **at session start**. This worker's listing is therefore the **pre-change** listing — it shows
the plain scalars as they were at `HEAD`. Nothing re-reads the listing mid-session, and **no test in
this repo substitutes for the loader**: `test/skill-frontmatter.test.js` reads the file bytes, while
Claude Code's own parser is what actually renders a description. That gap is exactly what task 0123's
silent failure lived in.

**Owner ruling (2026-08-01): ship anyway; report it as an outstanding residual; do not block on it.**

**It is dischargeable in one step, in any fresh fkit session:** compare that session's injected skill
listing against the captured baseline (see "Artifacts" below). All 25 must match byte-for-byte. If any
differ, name the skill — that is a real regression this task shipped.

---

## Owner-decision log

| # | Question put to the owner | Ruling | Effect on the build |
|---|---|---|---|
| 1 | Wrap the `>-` descriptions across indented continuation lines, or keep each on one long line inside the scalar? | **WRAP.** The coder's vacuity argument was accepted. | A single unwrapped line inside a `>-` scalar leaves the "every continuation line is indented past the key" clause with **nothing to check** — the guard's clause 5 would be vacuously true on all 25 files. Wrapping at ~100 columns gives it real continuation lines. Every one of the 25 now has 2–6 of them. |
| 2 | Block on brief verification step 5 (the live-loader eyeball), which the building session structurally cannot perform? | **Ship with it OUTSTANDING.** Capture the baseline so it is dischargeable; flag it loudly; do not describe it as done. | Step 0c baseline captured. Flagged at the top of this file, and in the return envelope's `residuals`. |

No further decisions were needed — nothing in the build went outside the approved plan, so nothing was
returned as `NEEDS-DECISION`.

---

## What was done

### 0a. Baseline — green before touching anything

The working tree was **not clean** at start: `AGENTS.md`, `CLAUDE.md`, `ai-agents/sprints/sprint-2.md`,
this brief, `claude/fkit-claude-init.sh`, `claude/scaffold/universal-rules.md` and
`test/rules-block-budget.test.js` were already modified by sibling sprint tasks, and 0130 was already
moved to `done/`. `claude/skills/` itself was **entirely clean at HEAD** — which is what made the
step-0b baseline trustworthy.

`npm test`:

```
ℹ tests 523
ℹ pass 523
ℹ fail 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

So every red below is attributable to 0136, not to a sibling task.

### 0b / 0c. Baselines captured

- `desc-before.tsv` — the 25 descriptions read from `git show HEAD:…` with a **plain-scalar** reader.
  Sourced from git, so it cannot be contaminated by this task's own edits.
- `listing-before.txt` — the 25 descriptions as the **live loader** rendered them in this worker's
  injected listing at session start.

**An unplanned extra check, and it is the strongest evidence in this worklog:** those two files were
compared and are **byte-identical across all 25**. That means `desc-before.tsv` is not merely one
reader's opinion of the old text — it is confirmed to be exactly what the loader itself produced. So
proving `desc-after == desc-before` proves the target text is unchanged against a **loader-validated**
baseline. It does **not** prove the loader renders the *new* file the same way; that is residual 1
above, and nothing here closes it.

The check also independently confirms 0123 review **R4**: the three files carrying a same-line `": "`
(`fkit-dumb-down`, `fkit-task-brief`, `fkit-task-ship-loop`) did render correctly — the loader
tolerates a same-line colon while strict YAML rejects it. They were invalid, not broken. That is the
whole reason a colon-hunting regex was the wrong guard.

### 1. Converted all 25 descriptions to `>-` block scalars

Done by a one-shot script in the scratchpad — **never committed**, a migration tool, not test coverage.

Pre-scan first: no description contained a double space, a tab, or edge whitespace, so every wrap
point is an unambiguous single space. Wrapping breaks **only** at an existing single space, at ~100
display columns including the 2-space indent, and the text is never reworded, re-punctuated, or
tidied.

24 files went from 1 line to 3–7; `fkit-sprint-ship-loop` went from a 4-line plain scalar to a 5-line
block scalar (inserting `>-` and indenting the first content line), as predicted — the lowest-risk of
the 25 despite being the file 0123 broke.

Post-conditions checked mechanically:

- all 25 declare exactly one `description: >-` — **zero plain scalars remain** (brief step 1);
- **no trailing whitespace and no tabs** anywhere in any skill frontmatter;
- `claude/scaffold/` re-confirmed to contain no skill tree, so nothing is dual-homed.

### 2. Proved the rendered text did not change — stated method, as the brief requires

**Comparison method, verbatim:**

1. `desc-before.tsv` — 25 descriptions read from `git show HEAD:claude/skills/<n>/SKILL.md` with a
   **plain-scalar** reader (drop the `description:` key, `trim()` each continuation line, join with a
   single space).
2. `desc-after.tsv` — the same 25 read from the **working tree** with an independently written **`>-`
   folding** reader implementing real fold semantics: base indent from the first non-empty content
   line; base-to-base break folds to one space; a more-indented line keeps its newline; a blank line
   becomes a newline; a less-indented line ends the scalar; `-` chomps the trailing newline.
3. `diff desc-before.tsv desc-after.tsv` must be **empty** — byte equality of all 25 values, not
   "looks the same".
4. On mismatch, print a character-index diff and fix the wrap, never the text.

**Result: the diff is EMPTY. All 25 descriptions are byte-identical before and after.** Re-run once
more after the mirror refresh, still empty.

Two independent implementations read the two sides, and the `git show HEAD:` source makes the baseline
unforgeable by this task's own edits.

`git diff --stat claude/skills/` — exactly **25 files changed, 120 insertions, 26 deletions**. Every
hunk header sits at **line 3** (`@@ -3 +3,N @@ name: fkit-…`), i.e. **every change is confined to the
frontmatter**; not one skill body line moved.

### 3. `test/skill-frontmatter.test.js` — new, hand-rolled, zero devDeps

`package.json` is **unchanged** — no YAML library, per ADR-014. Block scalars are what make
hand-rolling tractable, which is the second reason the conversion had to come first.

Functions: `splitFrontmatter`, `findKey`, `foldBlockScalar`, `auditFile`, `renderViolations`, plus
`discoverSkillFiles` / `discoverAgentFiles`. Violations carry stable `E1`–`E7` codes so a test names
the rule rather than matching prose that will be reworded:

| Code | Rule |
|---|---|
| E1 | no frontmatter, or not the first thing in the file (line 1 must be exactly `---`) |
| E2 | `name:` missing |
| E3 | `description:` missing |
| E4 | `description:` is not a `>-` block scalar — **the structural rule (R5)** |
| E5 | a continuation line is not indented past the key / the scalar ended early |
| E6 | a continuation line is indented with a TAB |
| E7 | the folded value is empty, or is not a single line |

21 tests, all green: a conforming file passes; one test per violation including the brief's **fixture
A** (plain scalar → E4 alone) and **fixture B** (de-indented continuation line → E5); `foldBlockScalar`
unit tests pinning each fold rule; a `renderViolations` message test (the R39 lesson — asserting the
field leaves the rendered message unguarded); discovery tests including the R33 `withFileTypes` case
(a *directory* named like an agent file must not satisfy non-vacuity); and the two live-corpus tests.

Live corpus: **25/25 skills and 7/7 agents pass every clause.** Non-vacuity is asserted first in both,
with a message saying the scan is *vacuous, not clean* if the tree moved.

New env seam `FKIT_FRONTMATTER_ROOT` (default `join(REPO, 'claude')`), with the stderr warning when
non-default — same reasoning as `FKIT_LAUNCHER`: a stale inherited value must be loud, or `npm test`
silently audits some other tree and reports green.

**Three limits are written into the file's own header, not left to be discovered:**

1. It reads **frontmatter only**. A skill's **body** — the procedure itself, the entire point of the
   file — remains untested by anything in this repo. A green run here is **not** coverage of skill
   behaviour. The brief says this outright and so does the header.
2. It is **not the loader**. It reads bytes; Claude Code's parser is the authority.
3. **E5 has a real residual.** It decides "a continuation line lost its indent" by asking whether the
   column-0 line that closed the block reads like a `key:` declaration. A de-indented continuation
   line that *happens* to begin `word: …` is indistinguishable from a real frontmatter key and is
   **not caught**. Closing that needs a full YAML parser, which ADR-014's zero-devDeps rule forbids.
   `prove-red.sh` mutation 9's failure message points at this residual explicitly, so if the mutation
   ever stops reddening, the next person is told where to look.

**One deliberate strengthening beyond the brief's literal wording, recorded so it is not mistaken for
drift.** The brief's clause is "every continuation line is indented **more than** the `description:`
key". E5 also flags a continuation line indented **less than the scalar's base indent** but still
greater than zero (e.g. one space where the rest use two). Same defect, same hazard class — a
de-indent that silently truncates the description — and it is exactly the uniform-indent rule the
approved plan already required ("indent exactly 2 spaces on every continuation line, uniform"). Not a
new rule; the plan's rule made mechanical.

### 4. `test/prove-red.sh` — 0g plus mutations 8 and 9

- `run_frontmatter_suite()` added, same green/red + `$out` contract as the existing helpers. It points
  at a whole **directory** rather than one script, which is the one way this seam differs from the
  hook seams.
- **`0g.` unmutated-copy-is-green**, reusing the existing `claude-clean` copy. Without it, a red below
  could be red-via-setup and would prove nothing.
- **Mutation 8** — one skill's `description: >-` plus its first content line spliced back into a
  **plain scalar** (the shape all 25 were in before this task).
- **Mutation 9** — the **second content line** of `fkit-sprint-ship-loop`'s block scalar de-indented to
  column 0 (deliberately that file: it is the one 0123 broke).

Both carry the `cp … .orig` + `cmp -s` **no-op guard** that fails the run loudly if the mutation stops
matching. That guard is not decoration — `prove-red.sh`'s own header records that mutation 1 was
silently disarmed for a whole task while `npm test` reported green over a dead gate. Both greps are
anchored on the **named assertion**, so a red for the wrong reason is caught.

Both mutations are anchored on **structure, not on the descriptions' wording** (`awk` on
`^description: >-$` and on content-line position), so a future rewrap cannot silently disarm them.
`awk` rather than `sed` because mutation 8 is a two-line join.

**`sed` vs `awk` is the only departure from the approved plan's letter** — the plan said `sed`. The
substance the plan cared about (a fresh `make_claude_copy`, the `cmp -s` no-op guard, the named-
assertion grep) is unchanged; `sed` simply cannot do a portable two-line join.

### 5. Run and record — the red run, per ADR-014

**Mutation 8** — `fkit-team`'s frontmatter after mutation:

```
---
name: fkit-team
description: Show the fkit agent team — who's on it, what each role may and may not do, how to reach each one,
  and which role this session is locked to. Use when you're not sure who to talk to or how.
---
```

Red run:

```
✖ live corpus: every skill SKILL.md frontmatter conforms (3.412792ms)
  AssertionError [ERR_ASSERTION]: 1 of 25 skill files have broken frontmatter. A broken description
  does NOT error at load time — the listing silently falls back to the file H1 (task 0123). Fix the
  frontmatter; do not reword the description.
    skills/fkit-team/SKILL.md
      - E4 description: must be a >- folded block scalar, found: "description: Show the fkit agent
        team — who's on it, what each role may and may not do, how to reach each one,"
```

**Mutation 9** — `fkit-sprint-ship-loop`'s frontmatter after mutation (note line 5 at column 0):

```
---
name: fkit-sprint-ship-loop
description: >-
  The lead's sprint-scope conductor loop — drives eligible tasks brief→closed by spawning role
workers and relaying owner decisions live through this session. Since ADR-033 the driver closes
  nothing itself — it spawns a producer to close each shipped task, and that producer writes the
  agent-closed marker. Session-only; the driver holds the owner channel workers lack.
---
```

Red run:

```
  AssertionError [ERR_ASSERTION]: 1 of 25 skill files have broken frontmatter. …
    skills/fkit-sprint-ship-loop/SKILL.md
      - E5 description: the block scalar was ended by a line at column 0 that is not a `key:`
        declaration — a continuation line lost its indent: "workers and relaying owner decisions live
        through this session. Since ADR-033 the driver closes"
```

Same named assertion, **two different violations** (E4 and E5) — which is what proves the live-corpus
check is load-bearing for both hazards rather than for one of them.

Full `npm test` after the change:

```
ℹ tests 544
ℹ pass 544
ℹ fail 0
0a…0g. all green
1…9. each mutation reds its NAMED assertion
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

523 → 544: exactly the 21 new tests, nothing else moved.

### 6. Agents — pass unchanged, nothing edited

All 7 `claude/agents/*.md` already used `description: >-` with uniform 2-space continuation lines and
pass every clause. **No agent file was touched** (`git diff --stat claude/agents/` is empty). Brief
step 6's escalation path was never needed.

### 7. `.claude/` mirrors refreshed

`./claude/fkit-claude-init.sh .` → "refreshed 7 agents → .claude/agents/, 25 skills → .claude/skills/".
`diff -r` for all **25 skills** and all **7 agents**: every diff **empty**. `.claude/` is confirmed
gitignored (`.gitignore:14`, `.gitignore:17`) and was never an edit site.

### 9. No commit

Everything is left in the working tree, as the brief and the plan require.

---

## Change surface

**Written by this task:**

- `claude/skills/*/SKILL.md` × 25 — **frontmatter only**, every hunk at line 3.
- `test/skill-frontmatter.test.js` — new, 21 tests.
- `test/prove-red.sh` — `run_frontmatter_suite()`, step `0g`, mutations 8 and 9.
- `.claude/skills/` and `.claude/agents/` — refreshed mirrors, **gitignored**.

**Confirmed NOT touched by this task:** `package.json` (no `devDependencies` added),
`claude/agents/*.md`, `claude/scaffold/`, and every skill body.

**⚠️ Review scope note — the working tree carries sibling-task changes that are NOT 0136's.** Present
and already dirty at the 0a baseline, from other tasks in this sprint: `AGENTS.md`, `CLAUDE.md`,
`ai-agents/sprints/sprint-2.md`, `claude/fkit-claude-init.sh`, `claude/scaffold/universal-rules.md`,
`test/rules-block-budget.test.js`, the 0130 move to `done/`, and the untracked
`ai-agents/tasks/backlog/0177-…/`. A reviewer must scope to the change surface above.

## Verification against the brief's own steps

| # | Brief verification step | Outcome |
|---|---|---|
| 1 | All 25 declare `description: >-`; zero plain scalars remain | **PASS** — checked mechanically |
| 2 | Every rendered description unchanged; report the comparison method | **PASS** — empty diff over all 25; method stated verbatim above |
| 3 | Test fails on a plain scalar and on a de-indented continuation line; show the red run | **PASS** — mutations 8 and 9, both red at the named assertion, output pasted above |
| 4 | `node --test test/*.test.js` green including the new file | **PASS** — 544/544 |
| 5 | **Live skill listing renders all 25 correctly — eyeball it** | **⚠️ OUTSTANDING / UNVERIFIED** — structurally impossible from the building session; owner ruled ship-anyway; baseline captured, dischargeable in a fresh session. **Not done.** |
| 6 | `claude/agents/*.md` pass the same guard unchanged | **PASS** — 7/7, no agent file edited |
| 7 | Refresh `.claude/` mirrors and diff each | **PASS** — 25 + 7, every diff empty |

## Artifacts (scratchpad — NOT committed, one-shot tools, not test coverage)

Under
`/private/tmp/claude-501/-Users-mark-dolbyrev-Workspace-fkit/8c05eb47-1374-47ed-8320-e90d8ce782fe/scratchpad/0136/`:

- `desc-before.tsv` — 25 descriptions from `HEAD`, plain-scalar reader.
- `desc-after.tsv` — 25 descriptions from the working tree, `>-` folding reader.
- `listing-before.txt` — **the live-loader baseline for residual 1.** Loader-rendered text for all 25,
  captured at session start, verified byte-identical to `desc-before.tsv`.
- `read-plain.js`, `read-folded.js`, `migrate.js` — the throwaway readers and the migration script.

⚠️ **These live in a session-scoped scratchpad and will not survive.** Since `desc-before.tsv` was
proven byte-identical to `listing-before.txt`, and `desc-after.tsv` byte-identical to `desc-before.tsv`,
the baseline for residual 1 is **reconstructible from git at any time**: read the 25 descriptions from
`git show <this-commit>:claude/skills/<n>/SKILL.md` (or from the current working tree — the values are
the same). Residual 1 is therefore dischargeable even after the scratchpad is gone.

## Residuals

1. **⚠️ OUTSTANDING — brief verification step 5, the live-loader eyeball. UNVERIFIED, not passed.**
   Discharge it in any fresh fkit session by comparing that session's injected skill listing against
   the 25 folded descriptions. All 25 must match byte-for-byte; name any that differ.
2. **Accepted, documented in the test header — E5's `word: value` blind spot.** A de-indented
   continuation line beginning `word: …` is indistinguishable from a real frontmatter key without a
   YAML parser, which ADR-014 forbids.
3. **Accepted, stated in the brief and re-stated in the test header — frontmatter only.** Skill
   **bodies** remain untested by anything in this repo. Do not read this task's green suite as
   coverage of skill behaviour.
4. **Pre-existing, not introduced here** — `test/prove-red.sh`'s header still says "Two mutations" and
   lists only 2; there are now 9. It went stale across tasks 43, 0127, 0129 and now 0136. Left alone
   deliberately: outside the approved plan, and a header rewrite is a separate, reviewable change.

---

# Round 1 review — response (2026-08-01)

Ledger: `review.md`. Reviewer verdict was **⚠️ Changes requested — 4 defects (none blocking)**, six
findings R1–R6. **The owner ruled on all six and directed that every one be fixed.** R2 and R6 are
frontier-moves adopted on that ruling; they were not closed on the coder's own authority. All six
verified against the code first — all six CORRECT, none refuted. Full verdict table and the
verification evidence live in `review.md`'s *Coder response*; this is the build record.

## What changed

Only `test/`. **No `claude/skills/*/SKILL.md` or `claude/agents/*.md` was touched**, so the step-2
byte-comparison proof and the `.claude/` mirrors stand untouched — re-confirmed: the `claude/` diff is
still exactly 25 files / 120 insertions / 26 deletions, all 25 hunks at line 3, zero hunks elsewhere.

`test/skill-frontmatter.test.js`
- **E8 (new, R1)** — a continuation line with trailing whitespace. It is invisible in an editor and it
  *changes what renders*: folding joins two base-indent lines with one space, so a line ending in a
  space renders a **double** space. E7 cannot see it — the result is still a good single line.
- **E9 (new, R3)** — a frontmatter key declared twice. Runs *before* the E4 early return so it survives
  it. A real loader keeps the **last** duplicate while `findKey()` reads the first, so a second
  `description:` carrying a plain scalar was defeating the structural rule with `auditFile()` silent.
- **`KNOWN_KEYS` allowlist (R2)** — `['name','description','color','initialPrompt','tools']`, the whole
  vocabulary, re-counted across all 32 files. Only a member may end the block scalar. The E5 message
  names both causes — a lost indent **or** a legitimately-added sixth key — because closing the set
  makes the second one possible.
- **`foldBlockScalar()` rewritten (R4)** — tracks a pending blank-line count; blanks adjacent to a
  more-indented line now yield k+1 breaks instead of k.
- **Exact count pins (R6)** — `EXPECTED_SKILLS = 25` / `EXPECTED_AGENTS = 7` replace `length > 0`, whose
  green run over a **partial** corpus was the defect. The failure message says outright that the count
  is bumped deliberately as part of adding or removing a skill, never to turn a red run green.
- Seven new tests (21 → 28).

`test/prove-red.sh`
- **Header count corrected (R5)** — "Two mutations" → **NINE**, with a one-line index of all nine and
  the named assertion each trips, plus an explicit "keep this in step when you add one".

## Verification

- **`npm test`: 551 pass / 0 fail, 17 suites** (was 544; +7 new tests). `npm test` runs
  `node --test test/*.test.js && bash test/prove-red.sh`, so the hard gate is inside that green.
- **`bash test/prove-red.sh` run standalone as well: `0a`–`0g` green, mutations 1–9 all red, exit 0.**
- **Mutations 8 and 9 re-verified at the VIOLATION, not just the test name.** Both fire inside the same
  named test as the new count pin, so a matching grep alone could not tell a real red from a
  red-for-the-wrong-reason. Replayed by hand: mutation 8 reds at **E4**, mutation 9 at **E5**, each
  reporting "**1 of 25** skill files" — which also proves the count assertion passed rather than being
  what failed.
- **The new tests are non-vacuous** — all three new fixtures were run against the **pre-fix**
  predicates and were **silently clean** under the old reader. The R6 pin was armed the same way: a
  tree with one skill directory removed now reds, where `24 > 0` was green.
- **R4 checked against a real YAML parser, not against itself** — all 363 line-sequences of length ≤ 5
  over {base, more-indented, blank} compared to Ruby's Psych. 241 are legal YAML; the **old** code
  mismatched **49**, the new code mismatches **0**. Psych is a development-time oracle on the box, not a
  dependency — **`package.json` still has no `devDependencies`** (re-checked). ADR-014 intact.
- Not committed, not pushed. Task not closed.

## Residuals after round 1

1. **⚠️ STILL OUTSTANDING — brief verification step 5, the live-loader eyeball. UNVERIFIED, not
   passed.** Unchanged by this round; the owner ruled ship-anyway. Discharge it in a fresh fkit session
   by comparing that session's injected skill listing against the 25 folded descriptions.
2. **E5's blind spot — NARROWED, and no longer described as "inherent".** Rewritten per the owner's R2
   ruling. It is now only a de-indented line beginning with one of the five known keys; before R2 any
   `word:` line slipped through. The remainder is closed by policy, not by nature — a real YAML parser
   would fix it, and ADR-014's zero-devDeps rule is the deliberate choice ruling that out. Revisitable
   the day that policy is.
3. **Frontmatter only — skill BODIES remain untested.** Unchanged.
4. ~~`prove-red.sh` header says "Two mutations"~~ — **closed this round (R5).**
5. **NEW, surfaced not absorbed — a documented limit in `foldBlockScalar()`.** A whitespace-only line
   indented *deeper* than base is a more-indented content line to YAML (`"foo\n \nbar"`); this function
   still treats every whitespace-only line as blank (`"foo\nbar"`). **Not reachable undetected** — E8
   rejects any such line by definition. Documented at the function rather than fixed, because fixing it
   was outside the R4 ruling, and so the "matches `>-`" claim is not stated more broadly than the 241
   cases actually tested. **Not an accepted residual yet — the owner has not ruled on it.**
