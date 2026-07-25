# Convert every skill `description:` to a `>-` block scalar, then add a frontmatter-parse guard test

## ID
0136

## Sprint
Sprint 2

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**A broken `SKILL.md` frontmatter fails silently, and nothing in fkit catches it.** Task 0123 proved this
by accident: the coder put a colon on a **continuation line** of a multi-line YAML `description:`. The
frontmatter stopped parsing and the skill listing **fell back to the file's H1** as the description. Nothing
errored, no test went red, and the only signal was the listing text changing — noticed by eye.

**The hazard is structural, and it is live today.** Verified 2026-07-25:

- **Zero** of the 25 `claude/skills/*/SKILL.md` files use a block scalar; all 25 use a bare **plain**
  scalar `description: …`.
- **Three** of them carry a same-line `": "` in that plain scalar — `claude/skills/fkit-dumb-down/SKILL.md`,
  `claude/skills/fkit-task-brief/SKILL.md`, `claude/skills/fkit-task-ship-loop/SKILL.md`. That is **invalid
  strict YAML** (a strict parser rejects it with *"mapping values are not allowed in this context"*); it
  renders only because Claude Code's loader tolerates a same-line colon while breaking on one in a
  continuation line. Task 0123 review **R4** established this — the earlier claim that it *"does parse"* was
  wrong.
- **All 7 `claude/agents/*.md` files already use `description: >-`** and are therefore **immune** — a colon
  inside a block scalar is just text. Those files contain 8 continuation lines with `": "` and one trailing
  bare colon, entirely harmlessly. Task 0123 review **R5**: that structural fact, not any regex, is the
  actual guarantee.
- **No script or test in this repo parses `SKILL.md` frontmatter.** Only Claude Code's loader does
  (`claude/fkit-claude.sh` expresses role→skill ownership by *name*, never by reading a description).

**So the fix is to eliminate the hazard class, not to test one instance of it** — make every skill immune
the way every agent already is, then add the first automated reader so a regression goes red instead of
silent.

**⚠️ Why this is ONE task and not two.** Converting first and guarding later leaves the conversion with
**no automated verification at all** — its only check would be eyeballing 25 descriptions in a live skill
listing, which is precisely the kind of manual sweep that drifts. Guarding first is worse: the guard has
three pre-existing failures to grandfather on day one. The two halves verify each other, so they ship
together. **Order inside the task is binding: convert, then guard.**

## What to build

1. **Convert all 25 `claude/skills/*/SKILL.md` `description:` values to a `>-` folded block scalar**,
   matching the shape the agent definitions already use (`claude/agents/fkit-coder.md:3` is the reference).
   - **The rendered description must not change.** A `>-` folded scalar joins continuation lines with a
     single space and strips the trailing newline; indent every continuation line consistently. Compare
     before/after text, not just the diff.
   - 24 descriptions are currently single-line; **one is multi-line** —
     `claude/skills/fkit-sprint-ship-loop/SKILL.md` (3 continuation lines). Handle that one with extra care;
     it is the file 0123 broke.
   - The three known-invalid files (`fkit-dumb-down`, `fkit-task-brief`, `fkit-task-ship-loop`) become valid
     as a consequence — that is the point, not a separate step.
   - **Skills are NOT dual-homed.** Verified 2026-07-25: `claude/scaffold/` contains `AGENTS.md`,
     `CLAUDE.md`, `universal-rules.md`, and `ai-agents/` — **no skill tree**. Re-confirm before editing;
     if that has changed, both copies move together per
     [`dual-home-parity.md`](../../../knowledge-base/conventions/dual-home-parity.md).

2. **Then add `test/` coverage — a hand-rolled frontmatter reader.**
   **Constraint: [ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)'s zero
   devDeps.** `package.json` has no `devDependencies` and this task does not add one — so **no YAML
   library.** Hand-roll the reader; block scalars are what make that tractable, which is the second reason
   step 1 comes first.
   Assert, across **both** `claude/skills/*/SKILL.md` **and** `claude/agents/*.md`:
   - A frontmatter block exists, delimited by `---` … `---`, as the first thing in the file.
   - `name:` and `description:` are both present.
   - **`description:` uses a `>-` block scalar** — the structural rule, per R5. This is the assertion that
     eliminates the class; a colon-hunting regex would only chase one token.
   - Every continuation line of the description is **indented more** than the `description:` key. This is
     the one hazard a block scalar does *not* absorb: a de-indented continuation line still ends the scalar.
   - The parsed description is a non-empty single-line string after folding.
   - The reader is exercised against a **known-bad fixture** so the test is proven able to fail
     (`test/prove-red.sh` is the existing seam for this — use it).

## Verification steps

1. All 25 `claude/skills/*/SKILL.md` files declare `description: >-`; **zero** plain scalars remain.
2. Every rendered description is **unchanged in content** — compare the folded result against the previous
   value for each of the 25, and report the comparison method. A silently-reworded description is a
   regression this task must not ship.
3. The new test fails on a deliberately broken fixture (a plain scalar, and separately a de-indented
   continuation line) and passes on the real tree. **Show the red run**, per ADR-014.
4. `node --test test/*.test.js` is green, including the new file.
5. **The live skill listing renders all 25 descriptions correctly** — eyeball it. ⚠️ This step is not
   redundant with step 3: the test reads the file, the loader is what actually parses it, and no test in
   this repo can substitute for the loader. Name any description whose listing text changed.
6. `claude/agents/*.md` pass the same guard unchanged (they should — they already use `>-`). If any fails,
   that is a real pre-existing finding: report it, and get a disposition before changing an agent file.
7. Refresh the gitignored `.claude/skills/` mirrors and `diff` each against its canonical source.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** nothing. Independent of the ADR-033 chain (0124–0126) and of 0134/0135.
- **Blocks:** nothing.
- **⚠️ Touches `claude/skills/fkit-task-ship-loop/SKILL.md` and `claude/skills/fkit-sprint-ship-loop/SKILL.md`
  (line 3 only, the `description:`).** Both currently carry **uncommitted** edits from tasks 0122 and 0123.
  Coordinate: this is a frontmatter-only change and should not conflict, but check the working tree state
  before starting rather than assuming.
- **Source:** task 0123 review findings **R4** and **R5** (R4 Codex-raised); named as follow-up 2 in
  [0123's worklog](../../done/0123-route-sprint-ship-loop-close-to-producer/worklog.md).
- **Filed 2026-07-25** by the producer on the 0123 ship-loop's hand-off, and **scheduled into Sprint 2 at
  priority 114** — a producer call, cheaply reversible by moving the row. Rationale: the hazard is live in
  the runtime every fkit role depends on, the fix is small, it is independent of everything else in flight,
  and 0123 demonstrated the silent failure for real rather than hypothetically.
- **What this does NOT fix:** the guard reads **frontmatter only**. A `SKILL.md`'s *body* — the procedure
  itself — remains untested by anything, which is why 0123's 511-passing suite proved no regression rather
  than proving the change. Do not let this task's green test be read as coverage of skill behaviour.
- **The three known-invalid files are not a defect to file separately** — they are this task's input.
- No commit — leave the edits in the working tree.
