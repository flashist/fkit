# Plan — 0153: the wiki completion flag must carry the folder ID and the brief path

- **Author:** fkit-coder (plan step of `/fkit-sprint-ship-loop`, sprint 2)
- **Planned:** 2026-07-27 · **Approved by the owner:** 2026-07-27, via `AskUserQuestion` in the driver
  session (option "Approve as planned") — no modifications, no additional rulings.
- **Status:** implemented 2026-07-27 — see `worklog.md`.
- **One correction to this plan, found during the build:** §5.2 below claimed the apostrophe in
  `Task N's` is typographic (U+2019). **It is ASCII U+0027.** The plan's *operative* text (§3
  new_strings, CHECK1's shell variable) already used ASCII and matched the file, so the change was
  unaffected; only this prose note was wrong. Left in place, struck through, rather than silently
  rewritten — see `worklog.md` §4.

## 0. Ground truth established before planning (all verified by execution)

| Claim | Verified how | Result |
|---|---|---|
| Block bounds and size | `grep -n` for both anchors, then `sed -n 'S,Ep' \| wc -l/-c` | `ingest` 51–83, `lint` 60–92, `sync` 95–127 — **33 lines each**; **2296 / 2296 / 2215 bytes** |
| The "byte-identical across three" claim | the byte counts above | **False.** Δ = 81 B = 27 non-blank lines × 3 spaces. `ingest` = `lint`; `sync` is the same text three spaces to the left |
| Min indent per block | `awk` over non-blank lines | **3 / 3 / 0** — `sync` sits at top level under `## Step 9`; `ingest`/`lint` nest inside a numbered step |
| Normalized equality | subtract each block's own min indent, compare | all three byte-identical → `UNIFORM` |
| Task 0154 landed? | `ls test/`; `ls -d ai-agents/tasks/*/0154*` | **No.** No `test/wiki-flag-convention.test.js`; 0154 still in `backlog/` |
| Any test reads a `SKILL.md` body? | `grep -rn` across `test/` | **No.** Every occurrence is a comment; no `readFileSync` of any `SKILL.md` |
| Other live consumers of the flag wording | repo-wide `grep` for `vault work is complete` / `not ready to close` / `Task N's` | **None.** Only the 3 SKILLs; all other hits are frozen history (0125's `done/` folder, the 2026-07-23 evaluation report) |
| Convention ships to consuming projects | `ls claude/scaffold/ai-agents/knowledge-base/conventions/` | `priority-is-rank-not-identity.md` present — so a **bare-path** citation resolves from a project root |
| Line-length lint | `awk` length survey; `ls`; `package.json` | None. These files already carry 260–339-char lines; zero devDependencies |

## 1. Scope and non-goals

Prose edits to **three files only**:

- `claude/skills/fkit-wiki-ingest/SKILL.md`
- `claude/skills/fkit-wiki-lint/SKILL.md`
- `claude/skills/fkit-wiki-sync/SKILL.md`

No source code, no test (the test is task 0154, which has **not** landed). No commit.

**Do not touch**, in any of the three: the hard-rule bullet, the "Which tasks to consider" scan, the
three-outcome rule (including "unrelated to this run → say nothing about it at all"), the null line
`No tracked task completed by this run.`, the "carries them verbatim" paragraph, the "do not spawn the
producer to close it yourself" clause, or the routing line
`@fkit-producer Run /fkit-task-done on <brief path>`.

**Do not touch `.claude/skills/`** — gitignored mirrors. **Do not touch `ai-agents/tasks/done/0125-*/`**
or `ai-agents/knowledge-base/reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md` —
frozen history.

**Do not re-indent `fkit-wiki-sync`'s block.** Its 0-space offset is correct for its position.

## 2. The two new flag strings (byte-identical in all three files)

Complete:

```
Task <NNNN>'s vault work is complete — ready to close (producer runs /fkit-task-done on ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)
```

Partial:

```
Task <NNNN>: partial — not ready to close (ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md)
```

Rationale: minimal diff off the landed shape, so the R5 routing line's `<brief path>` phrasing stays
consistent; `<NNNN>` names what it is and reappears visibly as the path's folder prefix, so the referent
is structurally unambiguous; the path is exactly what the block's own scan step already read.

**Each flag string stays on one physical line.** A wrapped backtick span would embed a newline plus
indentation, which differs between `sync` and `ingest`/`lint` — that breaks byte-identity.

## 3. The rule paragraph, added beneath the two lines

Four lines, preceded by one blank line, between the two flag bullets and the
`**If that produced no lines at all**` paragraph. At `sync`'s 0-space offset:

```
**`<NNNN>` is the task folder name's four-digit prefix** (equivalently the brief's `## ID`) — the same
four digits that open the path you emit, and the task's only identity. It is **never** the sprint
board's rank / `P<n>` Priority cell, which is mutable and re-ranked; see
`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md`. Substitute real values.
```

Cited as a **bare inline-code path, not a markdown link** — a relative link from an installed
`.claude/skills/fkit-wiki-*/SKILL.md` would not resolve, and bare citation matches how these SKILLs
already cite `ADR-033`, `ADR-018` and `schema.md`.

In `ingest`/`lint`, prefix all four lines with **3 spaces**. In `sync`, no prefix. Block grows
33 → **38 lines**; expected min-indents stay **3 / 3 / 0**.

## 4. Exact edits

Order: **ingest → lint → sync**. `ingest` and `lint` take an identical old/new pair (their blocks are
byte-identical); `sync` takes the same pair without the 3-space prefix. Old text:

```
   - complete → `Task N's vault work is complete — ready to close (producer runs /fkit-task-done)`
   - partial or uncertain → `Task N: partial — not ready to close`

   **If that produced no lines at all**
```

New text: the two strings from §2 plus the paragraph from §3, then the untouched
`**If that produced no lines at all**` line.

## 5. Verification — every check fails CLOSED

Full runnable commands are reproduced in `worklog.md` §5 alongside their observed output.

> **Corrected 2026-07-27 (review finding R1, owner ruled FIX NOW).** As first written this sentence was
> **aspirational, not a description**: `worklog.md` §5 recorded **outputs only** — no command body for
> any of CHECK1/2/3 or NC1–NC5. The sentence is now true: `worklog.md` §5.0–§5.2 carry the actual
> `norm()` awk program, the three check bodies, and all five negative controls as executed. Recording
> the correction rather than quietly editing the claim, because the gap is the point — **NC1's own false
> pass had the bug inside a control**, and outcomes without implementations are exactly what hides that.

- **CHECK1** — each new string appears exactly **1×** per file and **3×** in total; literal `Task N`
  count is **0**. Fails closed: `grep -c -F` returns 0 on a missing string and the equality tests
  reject 0.
- **CHECK2** — the folder-ID definition, the explicit negative (`never** the sprint`), the
  `P<n>` Priority cell mention, and the `priority-is-rank-not-identity.md` citation are present in all
  three.
- **CHECK3** — uniformity. Gates on **start anchor**, **end anchor**, a line-count **floor (36)** *and*
  **ceiling (45)** before comparing anything; subtracts each block's **own minimum indent** rather than
  blanket-stripping, so relative nesting survives; asserts min-indent is exactly **3 / 3 / 0**, which is
  what proves `sync` was not re-indented. A clean normalized diff alone would **not** catch a wrongful
  re-indent — the `MININDENT` assertion is the part that does.
- **CHECK3N** — four negative controls, each required to be *observed* firing: **NC1** 0125's real
  near-miss anchor (`The wiki \*\*closes nothing`) → `exit=3`; **NC2** empty input → `exit=3`;
  **NC3** one list item's relative indent broken → `FIRED`; **NC4** the whole `sync` block shifted by a
  uniform offset → `GREEN` (legitimate). **If any control misses, CHECK3's pass is discarded.**
- **CHECK4** — no SKILL invokes a mover; the routing line survives intact in all three; the R2 branch,
  R5 clause, null line and hard-rule bullet all still present (0125 verification steps 2–3).
- **CHECK5** — change surface scoped to the three files.
- **CHECK6** — `npm test` before and after, so any red is attributable.

⚠️ **The awk start anchor must be a literal regex inside the program, never passed via `-v`.** Verified:
`awk -v SA='The wiki \*\*closes nothing'` has its backslashes eaten and `SA` becomes
`The wiki **closes nothing`, which **matches** — silently defeating the anchor gate. This produced a
false pass on the first NC1 attempt during planning.

⚠️ **Never normalize with `sed 's/^ *//'`.** Reproduced directly: with one list item's indent broken by
a single space, blanket-stripping still reports the blocks identical. That is 0125's recorded residual
**R3** (its `plan.md` check 4 is fail-open), and it is what CHECK3 is shaped to avoid.

## 6. Edge cases and risks

1. **Wrapping a flag string breaks byte-identity.** ~150 chars each; keep on one line. Nothing in the
   repo punishes the long line.
2. ~~**The em dash and the typographic apostrophe are load-bearing.** `—` (U+2014) and `'` (U+2019, in
   `<NNNN>'s`) — copy the strings, do not retype.~~ **Corrected at build time:** the em dash `—`
   (U+2014) and the arrow `→` (U+2192) are load-bearing and were confirmed by codepoint dump, but the
   apostrophe is **ASCII U+0027, not U+2019**. `grep -c "Task N's"` = 1, `grep -c $'Task N’s'` = 0. The
   "copy, don't retype" instruction stands and is what made the error harmless.
3. **A gate that only checks non-empty is not enough.** 0125's near-miss anchor matched *zero* lines; an
   anchor matching the start but not the end would slurp the rest of the file. Hence both anchors, a
   floor **and** a ceiling.
4. **`sync` is at 0 indent by design.** Resist "fixing" it; CHECK3's `MININDENT=0` assertion is the
   catch.
5. **The block is prose enforced by nothing.** The ADR-018 hook never opens a `SKILL.md`; no test reads
   one. Deleting the whole block turns nothing red. That gap is **0154's** job — do not build a test
   here.
6. **Timing risk this change cannot fix (0126).** Task 0126 ranks **P109**, above this task's rank 117,
   and cannot be displaced without renumbering `✅ Done` rows at P110–P112. If 0126 runs first it emits
   a bare `Task N`. *(Discharged by an owner ruling at the plan gate — see `worklog.md` §7.)*
7. **No downstream consumer to update.** Verified repo-wide.
8. **Do not run `claude/fkit-claude-init.sh`.** Refreshing the gitignored mirrors is outside this brief.

## 7. Hand-off contents

The three edited paths; the two new flag strings verbatim; CHECK1/2/3 results **including the three
`MININDENT` values and `LINES=38`**; the four negative-control outcomes; the `BASELINE`/`AFTER`
`npm test` exit codes; the explicit statement that **0154 has not landed so no test required updating**;
and the 0126 timing warning. No commit.
