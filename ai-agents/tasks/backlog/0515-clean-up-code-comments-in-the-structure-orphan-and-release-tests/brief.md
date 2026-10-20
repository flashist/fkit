# Clean up code comments in the structure, orphan-cleanup and release tests

## ID
0515

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**This unit: the structure, orphan-cleanup and release tests** — the suites behind `/fkit-heal`, the
structure manifest and `bin/release.mjs`.

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

> **⚠️ Re-scoped 2026-10-20 — owner Q4 ruling at `0529`'s plan gate.** Via `AskUserQuestion`, live
> `fkit lead` session, question as shown: *"Q4 — The old test-related tasks (16 rows)?"* Selected
> option text, verbatim: *"Producer's proposals (Recommended)"* — description he saw: *"After 0529:
> cancel 0503, 0522, 0037, 0214, 0152, 0219; rescope 0513–0515; 0512/0156/0406 back to you. Knock-on:
> nothing waits on the 6 (checked); 0513–0515 depend on 0512."* Relayed to a spawned `fkit-producer`
> (no owner channel, ADR-021), who wrote this note. `0529` (✅ Done) cut the suite to shipped-script
> behaviour tests under ADR-057. This note narrows the unit to the files that survived; **where it
> differs from the *Scope* line, the *Watch* items, V2 or V4 below, this note wins.** The owner
> quotes above and the series rules are unchanged.
>
> - **Scope now — 6 files, ~640 comment lines** (same rough grep, 2026-10-20; recount at plan
>   time, V3): `test/structure-manifest.test.js`, `test/structure-check.test.js`,
>   `test/structure-notice.test.js`, `test/structure-repair.test.js`, `test/orphan-cleanup.test.js`,
>   and **`test/release/release-summary.test.js`** — moved there by `0529` from
>   `test/release-summary.test.js`. Deleted by `0529`, so out of scope: `structure-spec`.
>   `structure-manifest` is a named exception (ADR-057 §D7 ⛔ R1 note); its header cites §D7 —
>   keep that pointer.
> - **V2 now:** run what `CONTRIBUTING.md`'s *"What to run for a change"* table names for the touched
>   paths — `npm test`, **plus `npm run test:release`** if the edit touches
>   `test/release/release-summary.test.js` (it is outside `npm test`). `npm test` no longer runs
>   prove-red (ADR-057 §D3).
> - **V4 now:** every new pointer resolves, **checked by hand** — `test/reference-integrity.test.js`
>   is deleted and no automated link check runs any more (ADR-057 §D6 (a)). The five-comment
>   spot-check stays.
> - **The fourth category is gone.** ADR-057 §D7 retired it; `0529` already reworded the kept files'
>   headers to cite §D7. The *Watch* item about "the knowledge-base home `0512` created for the fourth
>   category" no longer applies — there is no such home to point at.
> - **`Depends on: 0512` is unchanged** — `0512`'s own fate (rescope or cancel) is pending the owner.
>   *Update 2026-10-20: the owner ruled — `0512` is re-scoped to 4 files, not cancelled (verbatim *"Rescope to 4 files (Recommended)"*). This line stands; the re-point below does not apply.*
>   ⚠️ Its reason (`0512` step 1, the fourth-category home) is gone under §D7. If `0512` is cancelled,
>   this line needs re-pointing to `0506`, `0507` (both ✅ Done), or this unit waits on a cancelled task.
> - **Not added to scope:** the dead `FKIT_RELEASE_MJS` test seam `0529` left in
>   `release-summary` (its plan step 5). Removing it changes code, which rule 1 forbids; the owner's
>   call.
> - **Related, not a dependency:** `0530` owns `release-summary`'s *"~6-minute gate"* comment and the
>   release gate (`0529`'s hand-off). If `0530` has not landed, leave that comment to it; whichever
>   lands second re-checks the other's cites (rule 5).

**[Superseded 2026-10-20 — see the re-scope note above.]** **Scope — 7 files, ~763 comment lines:** `test/structure-spec.test.js`, `test/structure-manifest.test.js`,
`test/structure-check.test.js`, `test/structure-notice.test.js`, `test/structure-repair.test.js`,
`test/orphan-cleanup.test.js`, `test/release-summary.test.js`.

Watch in this group: test-scope headers point at the knowledge-base home `0512` created for the fourth
category. `structure-manifest`, `structure-spec` and `structure-check` carry `path:NNN` cites — rule 5.

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
- **V2 — Tests pass.** *(⚠️ 2026-10-20: superseded — see the re-scope note under What to build.)* The checks `CONTRIBUTING.md`'s *"What to run for a change"* table names for the
  touched paths pass — for any non-`.md` file under `claude/`, anything under `test/`, or
  `bin/release.mjs`, that is the full `npm test` (it includes `test/prove-red.sh`, which mutates these
  files and can break if a mutation's pattern relied on a comment).
- **V3 — Count.** The worklog records the comment-line count of this unit's files before and after,
  measured with the same command both times.
- **V4 — Nothing lost.** *(⚠️ 2026-10-20: superseded — see the re-scope note under What to build.)* The worklog has a table of every reason **moved**: file + function/test name →
  knowledge-base destination. Every new pointer resolves (`test/reference-integrity.test.js` passes),
  and a reviewer spot-checks at least five deleted comments and agrees each was WHAT, name-repeating,
  history, or already recorded where its pointer says.
- **V5 — Inbound references.** The worklog lists the searches run for references into this unit's
  comments and line numbers, each hit, and the action taken (fixed, or left as frozen history).
- **V6 — Rule followed.** Every comment left in the unit's files is at most 2 lines, or the worklog
  names it as a must-not-break block the plan chose to keep longer, with the reason.

## Notes

- **Depends on:** 0506, 0507, 0512
- **Blocks:** nothing
- **Related, not a dependency:** `0510` (heal scripts) and `0511` (`bin/` tools) — whichever lands
  second re-checks the other's line cites (rule 5).
- **Related, not a dependency:** Backlog task `0373` (does `durable-citation-anchors.md` need an
  addendum for in-code comments citing their own file) — its answer may change how pointers are worded.
- **Placement:** Backlog board, per the owner's 2026-10-14 ruling. Knock-on: none — no task outside this
  series waits on any unit of it; inside it, every unit sits on the Backlog board (checked 2026-10-14).
- ⛔ **Do not start without the owner's specific word.** Being pullable is not his word.
- **Note, 2026-10-17 — method amendment M4k "text fences" (owner ruling at `0510`'s plan gate, relayed by `fkit-lead`).** Unit `0510` adds M4k: before editing a file, find any test or script that reads it as text, and keep its fenced words. See `0510`'s worklog, *"Method for the series"* (alongside `0507`'s M1–M4). Added by a spawned `fkit-producer` — no owner channel (ADR-021).
