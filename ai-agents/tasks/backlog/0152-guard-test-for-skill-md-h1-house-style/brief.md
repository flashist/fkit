# Guard test for the `SKILL.md` H1 house style — no skill may use the owner banner as its title

## ID
0152

## Sprint
Sprint 2

## Priority
133

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Task **0120** fixed the one skill whose H1 was the `⛔ Owner:` banner instead of a descriptive title
(`claude/skills/fkit-sprint-ship-loop/SKILL.md` — `# ⛔ Owner: the lead` → `# Sprint Ship-Loop (lead
side)`). **Nothing prevents the same drift recurring**, in that file or any other.

**The sweep, re-verified 2026-07-26 — the numbers differ slightly from the ones reported at filing
time, use these:**

- There are **25** `claude/skills/fkit-*/SKILL.md` files, not 26. (`ls claude/skills/*/SKILL.md | wc
  -l` = 25; this matches task 0136's independently-verified count of 25.)
- **Before 0120: 24 descriptive titles + 1 owner-banner H1.** That one file was the **sole** outlier —
  the convention was already universal, it was never written down or enforced.
- **After 0120's fix (present in the working tree, uncommitted at time of filing): 25 of 25
  descriptive.** So the guard would go green on day one with **nothing to grandfather** — unlike 0136,
  which has three pre-existing failures to handle.

**The load-bearing fact — skill-file *content* is an entirely untested surface.** Re-verified
firsthand 2026-07-26 by re-running the commands; the evidence for this claim was stated wrongly
**twice** before this, so the robust form is given first and the corrections after it.

**The robust statement — no test reads any `SKILL.md`'s content.** The **only** skills-related
filesystem access in the entire test suite is `test/harness.mjs:213` — a `readdirSync` of
`.claude/skills` returning **directory names only** (`withFileTypes`, filtered to `fkit-`-prefixed
directories, mapped to `e.name`). There is **no `readFileSync` of any `SKILL.md` anywhere in
`test/`**. Therefore no existing test asserts anything about a `SKILL.md`'s H1, and this task adds
**genuinely new coverage** rather than duplicating an existing guard.

| Reference | What it actually does |
|---|---|
| `test/harness.mjs:212–217` (`projectSkillDirs`) | `readdirSync` of `.claude/skills` → **directory names only**; never opens a file inside. The one skills-related fs access in the suite. Note it is a **`.mjs`** file, outside the `test/*.js` glob. |
| `test/dashboard-contract.test.js:28` | assembles a path via `join(REPO, 'claude', 'skills', 'fkit-status', 'dashboard.sh')` and executes that **script** — never reads a `SKILL.md`. |
| every `SKILL.md` mention under `test/` | a **comment** citing a `SKILL.md` rule in prose — no read, no assertion |

**Two corrections to evidence that circulated while this brief was filed — recorded so neither is
re-derived later.** The conclusion above was never in doubt; the citations for it were wrong.

- **The grep's hits are not the rows above.** `grep -rn "claude/skills" test/*.js` returns **2 hits**,
  and they are `test/dashboard-contract.test.js:1` and `test/task-id-uniqueness.test.js:35` —
  **both comments, neither executing code.** An earlier note reported **zero** hits (wrong); a later
  correction said the two hits were the `:28` and `harness.mjs` cases (also wrong). `:28` is **not** a
  grep hit at all — the path is assembled from string fragments, so the substring `claude/skills`
  never appears on that line.
- **`test/harness.mjs` could never appear in that grep.** It is a **`.mjs`** file and lies outside the
  `test/*.js` glob entirely, regardless of what it contains.

**⚠️ Do not over-claim the surface-opening credit — check the order first.** Task **0136** (priority
114, above this one) already commits to adding *"the first automated reader"* of `SKILL.md`
frontmatter. If 0136 lands first, this task is **one more assertion on a walker that already exists**,
not the opening of a surface, and it should reuse 0136's file walk rather than build a second one.
Read 0136's shipped test before starting. If this somehow runs first, then it *is* the surface-opener
and should leave a walk that 0136 can reuse. **Either way the two must not end up with two independent
`SKILL.md` readers.**

**Severity is low and the scope is small — record that, so it is not inflated.** The original defect
was cosmetic (0120's own words: *"purely cosmetic … no behavior changes"*), and the ADR-018 hook keys
off `skills_for_role()` in `claude/skills-for-role.sh`, never banner text. The value here is
**preventing recurrence cheaply on a surface nothing watches**, not fixing a live hazard.

**The coder deliberately declined to fold this into 0120 — that judgment was correct and is recorded
as such.** 0120 was scoped as a one-file cosmetic edit; adding a new enforcement surface to it would
have been new scope with its own review burden, exactly the fold-it-in pattern this project has
repeatedly paid for (see 0119).

## What to build

A hand-rolled guard test.

1. **A `node --test` test** asserting that **no** `claude/skills/*/SKILL.md` uses the `⛔ Owner:`
   banner as its first `#` H1. **ADR-014 keeps devDependencies at zero** — no YAML or markdown library;
   read the file and check the first `# ` line yourself.
2. **Assert the negative rule, not a positive title format.** The enforceable, 0120-established rule is
   *"the H1 is not the owner banner"*. Do **not** try to assert what a good title looks like — 25 files
   use 25 different shapes and a positive rule would be arbitrary.
3. **Reuse 0136's `SKILL.md` walk if it has landed** (see the ordering note above); otherwise write one
   small enough for 0136 to reuse.
4. **Cover the canonical tree only** — `claude/skills/`. The `.claude/skills/` copies are gitignored
   mirrors refreshed by `claude/fkit-claude-init.sh`; asserting against them would make the suite
   depend on whether init has been run.
5. **Document the rule in the test's header comment**, in the style the existing suites use — state the
   rule, cite task 0120 as its origin, and say what it does **not** catch (it does not check the
   blockquote banner is present, and it does not check the title is meaningful). Whether the rule also
   deserves a page under `ai-agents/knowledge-base/conventions/` is a separate producer/architect call
   — **not this task's scope**.
6. **Add a `test/prove-red.sh` mutation** if it is cheap in the existing harness shape — the suite's
   own convention is that a guard nobody has seen fail is not yet a guard. If it needs new
   infrastructure, **skip it and say so in the hand-off** rather than growing this task.

## Verification steps

1. The new test passes against the tree **as it stands after 0120** — 25 of 25 files green, nothing
   grandfathered, no skip list.
2. **Prove it can fail.** Temporarily set one `SKILL.md`'s H1 back to the `⛔ Owner:` banner form, run
   the test, see it go **red** naming that file, then revert. A guard never observed failing has not
   been verified.
3. The test names the **offending file** in its failure message. A bare `expected true to be false`
   would leave the next reader grepping 25 files.
4. `node --test` runs it with the rest of the suite; **zero** new devDependencies (`git diff
   package.json` empty, or no `package.json` change at all) — ADR-014.
5. The test reads **`claude/skills/`**, not `.claude/skills/`, and passes in a fresh clone where init
   has never run.
6. Exactly **one** `SKILL.md` file walk exists across the suite once both this and 0136 have landed. If
   0136 has landed and this adds a second walk, that is a defect in this task.
7. No `SKILL.md` file is modified by this task. It adds a guard; it fixes nothing (0120 already did).

## Notes

- **Owner:** fkit-coder — a test-suite addition.
- **Depends on:** nothing hard. **Soft-follows 0136** (priority 114) for the shared `SKILL.md` walk;
  see the ordering warning above. Also **soft-follows 0120**, which closed 2026-07-26 as
  `✅ Done (agent-closed — not owner-verified)` — the tree must be clean of the outlier before the
  guard can go green with no skip list, and as of that close it is (the H1 fix is in the working
  tree, uncommitted).
- **Blocks:** nothing.
- **⚠️ Added 2026-07-27 — there is now a THIRD claimant on the `SKILL.md` walk.** Task **0154** (rank
  127, `test/wiki-flag-convention.test.js`) also reads `SKILL.md` bodies. The *"the two must not end up
  with two independent readers"* warning above now covers **three** tasks — 0136 (P114), 0154 (127) and
  this one (131) — and the same rule applies: read whichever has landed and **reuse its walk**. Whether
  the three should share one harness file, or 0154 and this task should co-land in one `fkit-coder`
  session, is an **open question for the owner**, recorded in the sprint plan's 2026-07-27 re-rank
  addendum. This task was **not** promoted beside 0154 — that would be re-ranking existing work on
  producer judgment.
- **Source:** surfaced during **task 0120**'s plan step by the `fkit-coder` worker, which read all 25
  `SKILL.md` files and verified the test-coverage gap against the repo; owner-approved for filing
  2026-07-26 during the sprint-loop run that shipped 0120.
- **Ranking note.** Placed below the launcher pin-guards (0144/0145) and below 0146: this is the same
  class of work — pinning behavior **already verified correct** — and its recurrence risk is the
  lowest of the four, the convention having held in 24 of 25 files without any enforcement at all. It
  is placed above 0149 because 0149's cost of waiting is archival only.
- No commit — leave the test in the working tree.
