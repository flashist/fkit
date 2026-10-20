# Clean up code comments in the repo-content guard tests, and give the fourth test-scope category a home

## ID
0512

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**This unit: the repo-content guard tests** — the suites that check fkit's own `ai-agents/` content
(links, citations, IDs, parity, frontmatter, the rules-block budget). It goes **first among the test
units** because it holds a record the other test units point at.

⚠️ **A decision recorded only in test comments.** ADR-014 §2 fenced fkit's test scope at two
categories and ADR-017 rule 4 added a third. The **fourth** — an invariant over the repo's own content
— is recorded only in test headers: `test/task-id-uniqueness.test.js`'s header is the cited origin; 15
test files and 2 fixtures refer to it (checked 2026-10-14; a grep of `ai-agents/knowledge-base/` finds no
page that records it). Deleting those headers as "history" would lose the decision.

**Where this comes from.** Task `0506` (Sprint 10) adds the rule *"comment WHY, not WHAT"* to fkit:
convention `ai-agents/knowledge-base/conventions/code-comments.md` (being built by `0506` now; written
as a path, not a link, so `test/reference-integrity.test.js` stays green until it exists), plus a short line in the shared rules block
and in `fkit-coder.md`. `0506` governs **new and edited code only**. This task is part of the separate
cleanup of fkit's **existing** comments, which the owner asked for as its own brief.

**Owner rulings behind this brief** (relayed by the `fkit lead` session to a spawned `fkit-producer`
with no owner channel, ADR-021; ⚠️ the quotes are the lead's relay):
- 2026-10-10, `0506` open question 1 → **(c)**: the rule covers fkit's **code** — `claude/*.sh`,
  `bin/`, `test/` — and **not** the prose in `SKILL.md` or agent files (prompts, not code). Recorded in
  `0506`'s brief, *"Owner rulings"*.
- 2026-10-14, `AskUserQuestion`, asked *"Q3 — Should this task also clean up fkit's existing
  comments?"* (task `0506`). The owner typed: *"#1, but create a brief for cleaning the old code."*
  (#1 = "New/edited code only".)
- 2026-10-14, `AskUserQuestion`, asked *"Where should the 'clean up old code comments' brief be
  filed?"* Selected: *"Backlog board (Rec)"* — *"Waits on 0506 (Sprint 10). Knock-on: none — no open
  task waits on it."*

**How the cleanup was split.** ~10,100 comment lines in 58 files (rough grep of lines starting with
`#`, `//`, `*` or `/*`, 2026-10-14). The producer split it into nine comments-only units by module —
`0507` (pilot, sets the method) → `0508`–`0511` (code under `claude/` and `bin/`) and `0512` → `0513`–
`0515` (`test/`). Each unit is checked by the test suite on its own, so each ships on its own.
**Owner ruling, 2026-10-14 (AskUserQuestion, fkit-lead session):** asked "Keep the cleanup as 9
Backlog briefs (0507–0515), or merge into one?" Selected: "Keep 9 briefs (Rec)" — "Smallest shippable
pieces. Knock-on: none (checked) — all on Backlog board."

**Owner ruling, 2026-10-14 (AskUserQuestion, fkit-lead session) — what "`claude/*.sh`" in ruling (c)
covers:** asked "Your 10-10 ruling said the comment rule covers "`claude/*.sh`". Does that include the
scripts inside skill folders (dashboard.sh, heal scripts, .mjs)?" Selected: "All code under claude/
(Rec)" — "Keep all 9 briefs. Knock-on: none (checked) — all stay on Backlog board." So the scope is
**all code under `claude/`** — the top-level scripts **and** the executables shipped inside skills
(`claude/skills/*/*.sh`, `*.mjs`) and `carry-check-hook.mjs`. They are code, not prompt prose; the
`0506` planner's count (2,719 lines in `claude/`) already included them.

## What to build

**Scope — 10 files, ~2,041 comment lines:** `test/reference-integrity.test.js`,
`test/coordination-citation-policy.test.js`, `test/task-id-uniqueness.test.js`,
`test/adr-number-uniqueness.test.js`, `test/dual-home-parity.test.js`,
`test/dual-home-parity-exceptions.mjs`, `test/wiki-flag-convention.test.js`,
`test/skill-frontmatter.test.js`, `test/rules-block-budget.test.js`, `test/asking-the-owner-rule.test.js`.

1. **First, record the fourth test-scope category in the knowledge base** (destination per `0507`'s
   M1 — e.g. an addendum to ADR-014 or ADR-017; the plan proposes, the owner approves). Then every test
   header in this unit points there by name, not at `task-id-uniqueness.test.js`'s lines.
2. Then clean the comments, per the rules.

Watch in this group: `reference-integrity` and `coordination-citation-policy` say they **transcribe**
a report (`2026-08-29-the-reference-integrity-condition.md` §4) and must not be paraphrased — that
warning is must-not-break. Their provenance notes (commit, md5 of the transcribed revision) are a call
for the plan: provenance the test relies on, or history.

**Rules for every unit of this series** (the pilot `0507` may refine them; its worklog's *"Method for
the series"* section is then the source, and this list is the fallback):
1. **Comments only.** No change to code, strings, heredoc bodies, fixtures, or test assertions. A line
   starting with `#` or `//` **inside a heredoc, a string or a template literal is data, not a
   comment** — leave it. (The counts in this brief come from a rough grep and include some such lines.)
2. **Follow `code-comments.md`.** Keep the WHY: non-obvious decisions, shell/platform/SDK gotchas,
   workarounds and their reason, must-not-break rules — cut to 1–2 lines each. Delete WHAT-narration,
   name-repeating comments, and history (*"review finding R2"*, *"previously…"*, *"task N fixed…"*).
3. **Never delete the only record of a reason.** If a long reason is already recorded (the comment
   cites the ADR, report or convention that holds it), keep a one-line pointer and drop the copy. If it
   is recorded **nowhere else**, move it into the knowledge base first (an ADR addendum, a convention,
   or a report — the plan names each destination; an ADR gets a dated addendum, never a rewrite of its
   decision), then leave the pointer. Pointers go **by name or ID, never by line number**
   ([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
4. **Keep machine-read comments** — shebangs, `shellcheck`/lint directives, and any marker a script,
   hook or test reads. Before removing anything that looks like a marker, grep for readers.
5. **Fix live inbound references.** Before shortening or deleting a comment, search the repo for
   references to it: `path:NNN` cites, *"X's own comment records…"*, a test header citing another
   file's lines. Fix the **live** ones (skills, agents, conventions, tests, code — a `SKILL.md` edit
   that only repairs such a reference is allowed under ruling (c)). Leave **frozen history** alone —
   done task folders, dated reports, review ledgers, closed sprint boards: they cite a revision.
   Line shifts from deleting comments also break live `path:NNN` cites into these files — same sweep.
6. **Out of bounds:** `ai-agents/wiki-vault/` (the wiki role picks up knowledge-base changes on its
   next sync); the prose of `SKILL.md` and `claude/agents/*.md` (ruling (c)); `test/fixtures/`; the
   gitignored `.claude/` copies (edit `claude/`, then refresh with `claude/fkit-claude-init.sh .`).

## Verification steps

- **V1 — Comments only.** Every `-`/`+` line in `git diff` of the touched in-scope files is a comment
  line or blank. The worklog names the command used to check it, so a reviewer can re-run it. Any
  exception (for example a code line carrying a trailing comment) is listed by file and function or
  test name, with the code part shown unchanged.
- **V2 — Tests pass.** The checks `CONTRIBUTING.md`'s *"What to run for a change"* table names for the
  touched paths pass — for any non-`.md` file under `claude/`, anything under `test/`, or
  `bin/release.mjs`, that is the full `npm test` (it includes `test/prove-red.sh`, which mutates these
  files and can break if a mutation's pattern relied on a comment).
- **V3 — Count.** The worklog records the comment-line count of this unit's files before and after,
  measured with the same command both times.
- **V4 — Nothing lost.** The worklog has a table of every reason **moved**: file + function/test name →
  knowledge-base destination. Every new pointer resolves (`test/reference-integrity.test.js` passes),
  and a reviewer spot-checks at least five deleted comments and agrees each was WHAT, name-repeating,
  history, or already recorded where its pointer says.
- **V5 — Inbound references.** The worklog lists the searches run for references into this unit's
  comments and line numbers, each hit, and the action taken (fixed, or left as frozen history).
- **V6 — Rule followed.** Every comment left in the unit's files is at most 2 lines, or the worklog
  names it as a must-not-break block the plan chose to keep longer, with the reason.
- **V7 — The fourth category has a home.** A knowledge-base page records it; no comment in this unit
  points at another test file's lines for it.

## Notes

- **Depends on:** 0506, 0507
- **Blocks:** 0513, 0514, 0515
- The two files `test/fixtures/closed-rank-0174-*.md` also mention the category. They are fixtures
  (data) — out of scope, leave them.
- **Related, not a dependency:** Backlog task `0373` (does `durable-citation-anchors.md` need an
  addendum for in-code comments citing their own file) — its answer may change how pointers are worded.
- **Placement:** Backlog board, per the owner's 2026-10-14 ruling. Knock-on: none — no task outside this
  series waits on any unit of it; inside it, every unit sits on the Backlog board (checked 2026-10-14).
- ⛔ **Do not start without the owner's specific word.** Being pullable is not his word.
- **Note, 2026-10-14 — two more files, once Sprint 10 task `0484` is closed.** `0484` (link check for
  fkit's top-level docs) moved the link rule's shared functions, **with their comments**, out of
  `test/reference-integrity.test.js` into a new module, `test/link-condition.mjs`. It also added
  `test/top-level-doc-links.test.js`, whose header calls itself *"A repo-content guard: the fourth
  test-scope category"* — this unit's group, and none of `0513`–`0515` lists it. So once `0484` is
  closed as Done, this unit's scope also covers both files (12 files; recount the comment lines at
  plan time, V3). The new test's header points at `test/task-id-uniqueness.test.js`'s header for the
  fourth category, so step 1 and V7 apply to it; the module's header points at
  `test/reference-integrity.test.js`'s header for its record (rule 5: an inbound reference to keep
  true if that header is shortened). If `0484` is cancelled or its change is reverted,
  ignore this note. Soft scope note only — it adds no dependency link; `0484` sits in Sprint 10, ahead
  of this Backlog unit. Source: `0484`'s worklog, *"For the producer (not acted on)"*. Added by a
  spawned `fkit-producer` for `fkit-lead` (`/fkit-sprint-ship-loop`) — no owner channel (ADR-021).
- **Note, 2026-10-17 — method amendment M4k "text fences" (owner ruling at `0510`'s plan gate, relayed by `fkit-lead`).** Unit `0510` adds M4k: before editing a file, find any test or script that reads it as text, and keep its fenced words. See `0510`'s worklog, *"Method for the series"* (alongside `0507`'s M1–M4). Added by a spawned `fkit-producer` — no owner channel (ADR-021).
