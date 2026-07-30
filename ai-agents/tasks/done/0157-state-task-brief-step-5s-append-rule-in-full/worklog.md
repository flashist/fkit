# Worklog — 0157: state `/fkit-task-brief` step 5's append rule in full

**Task:** 0157 (Sprint 2, board rank P130). **Built:** 2026-07-30. **Driver:** `fkit-sprint-ship-loop`,
under its declared-approval marker (owner approved the plan via `AskUserQuestion` in the live driver
session on 2026-07-30, and approved both named widenings). **No commit** — edits left in the working
tree. **Change surface: one file**, `claude/skills/fkit-task-brief/SKILL.md`.

---

## 1. What was wrong

Step 5 stated the **default** (append after the existing highest priority; do not renumber or insert)
and was **silent on the sanctioned exception**. Read literally it is an absolute ban — under which the
owner-ruled re-ranks this board actually records would be violations. That silence is what let an
addendum recording an *outcome* without its *authority* be read later as licence to re-rank unbidden
(the 2026-07-27 failure that produced tasks 0157 and 0158).

Two further rules were **honoured in practice but written nowhere**: that closed rows are never
renumbered, and that a task is cited by folder ID rather than board rank.

## 2. What was changed

Five edits inside step 5, plus two cross-references so the file does not now contradict itself.

| # | Edit | Site |
|---|---|---|
| 1 | Append default kept **verbatim and unweakened** | step 5, bullet 1 |
| 2 | Merit-flag obligation made **mandatory**, in report **and** board addendum, with the verbatim `⚠️ Priority NNN is append rank, NOT a merit ranking…` form | step 5, bullet 1 |
| 3 | The owner-ruled exception: a re-rank is the owner's call, executed only on a ruling given **in this session**; a spawned producer **never** re-ranks | step 5, bullet 2 |
| 4 | Addendum-authority obligation — heading **and** first paragraph name four facts: owner ruled it, the date, the channel, and *"not producer precedent"* | step 5, bullet 3 |
| 5 | Closed-row carve-out — `✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are **never** renumbered, not even under an owner ruling | step 5, bullet 4 |
| 6 | Citation clause — name a task by folder ID, never by board rank; where relative order is the point, say it relatively | step 5, bullet 5 |
| 7 | Cross-reference added, prohibition **not** weakened | step 8 last bullet (`:330`) |
| 8 | Cross-reference added, prohibition **not** weakened | `## Rules` (`:369`) |

## 3. ⚠️ Two OWNER-RULED WIDENINGS beyond the brief — sanctioned 2026-07-30, not slipped in

Recorded here so a reviewer sees the authority, per the discipline this very task installs.

**Widening 1 — the closed-row carve-out covers THREE statuses, not two.** The brief's edit 4 says
`✅ Done` and `⛔ Cancelled`. The shipped text says `✅ Done`, `⛔ Cancelled` **and `➡️ Moved`**.
*Authority:* **the owner ruled it on 2026-07-30**, via `AskUserQuestion` in the live
`/fkit-sprint-ship-loop` driver session, on the coder's argument that the board's own rule statement
(`sprint-2.md:277` and `:372`) says three, and that following the board over the brief is correct where
they disagree. A `➡️ Moved` row is closed history by the same argument. **This is not coder precedent
for widening a brief.**

**Widening 2 — step 5 grows from 3 bullets to 7** (8 lines → 29; file 21503 B → 23687 B), beyond the
brief's *"should not triple it"*. *Authority:* **the owner ruled it on 2026-07-30**, same channel and
same session, accepting that the five required elements do not compress further without dropping one,
and that **no size guard applies to this file** — `test/rules-block-budget.test.js:30` governs
`claude/scaffold/universal-rules.md` only. **This is not coder precedent for exceeding a brief's stated
budget.**

## 4. Brief defects found and DELIBERATELY NOT FIXED

Confirmed by execution at plan time; the driver ruled all five out of scope for this task.

| # | Defect | Disposition |
|---|---|---|
| 1 | `## Scope` and `## Notes` say this task is *"P127, unchanged"*; its own `## Priority` field and the board both say **130**. The prose is stale by two displacements (128 → 129 → 130). | **0159's surface** |
| 2 | `sprint-2.md:518` (claimed *"The owner ruled: promote it beside 0147"*) now resolves to `:1089`. | **0159's surface** |
| 3 | `sprint-2.md:628` (claimed *"A re-rank is the owner's call"*) now resolves to `:1156`. | **0159's surface** |
| 4 | `## What to build` heading says *"Four edits"* over a five-item list. | Record defect; five were built |
| 5 | The verified-sites table cites `claude/universal-rules.md`, which **does not exist** — the real path is `claude/scaffold/universal-rules.md`. Its *verdict* ("Nothing") still holds: `/usr/bin/grep -ni 'priorit\|renumber\|rank'` on that file returns no match. | Record defect |

A sixth, in the brief's **verification steps** rather than its prose: step 7's *"`git diff --stat` shows
exactly one file"* **cannot pass** — the working tree was already dirty with five unrelated entries
before this task began. The plan replaced it with a captured-baseline delta (V5).

## 5. ⚠️ The verification caught its own defect — recorded because it is the finding

The plan said *"the verification is the only guard, so design it as if it were the deliverable."* The
driver then predicted the round's defect would hide in a check that passes for the wrong reason. **It
did, and it was caught before the checks were trusted**, by running V1 against the pre-edit baseline
copy and requiring it to **fail** there.

**Two of the plan's own V1 patterns did not discriminate.** Both already existed in step 8 of the
unmodified file, so both would have reported PASS against a file where the task had not been done at all:

- `grep -q '➡️ Moved'` — pre-existing at baseline `:293` and `:303`.
- `grep -q 'priority-is-rank-not-identity.md'` — **2** pre-existing hits at baseline.

Replaced with patterns unique to the new text (`` `⛔ Cancelled` and `➡️ Moved` rows are NEVER
renumbered ``, `never cite its board rank`). **Final V1: 10/10 absent from the baseline, 10/10 present
after.** V2 (anti-regression) was run the opposite way and **passes on both**, which is what proves its
patterns are correctly escaped rather than silently never matching.

## 6. ⚠️ This edit is prose in a file nothing tests — stated plainly

No test reads any `SKILL.md`'s **content**. Every `test/` reference to `fkit-task-brief` is either a
**comment** (`dashboard-contract.test.js:770`, `task-id-uniqueness.test.js:35`) or the skill-ownership
**name** matrix (`skill-ownership-hook.test.js:300,321`). `fkit-claude-init.sh:470` copies
`claude/skills/*` verbatim into gitignored `.claude/` — nothing generates or transforms this text.
**V1–V6 and V9 are the entire control surface, and they were run by hand.** Tasks 0152 and 0154 are
building the first two readers of `SKILL.md` content; per the brief, **no guard was added here** — a
third claimant on that walk is what 0154's brief warns against.

## 7. Verification results

| Check | Result |
|---|---|
| V1 — mechanical presence, 10 patterns | **PASS** (and 10/10 FAIL on the baseline — discriminating) |
| V2 — anti-regression, joined-line | **PASS** on baseline **and** after: append default + all three prohibitions intact |
| V3 — four reading tests, context-free reader | **PASS** — all four answers met the required bar, verbatim in the report |
| V4 — three sites agree | **PASS** — step 8 `:330` and `## Rules` `:369` carry the step-5 cross-reference; neither deleted nor softened |
| V5 — change surface | **PASS** — baseline delta is exactly one line: `M claude/skills/fkit-task-brief/SKILL.md` |
| V6 — no rank changed, no task moved | **PASS** — rank sequence byte-identical (145 cells); closed-folder count 132 → 132 |
| V7 — suite green | **PASS** — `node --test test/*.test.js`: **523 pass, 0 fail** |
| V8 — size accounting | 21503 B → 23687 B (+2184); 352 → 375 lines; step 5 8 → 29 lines. No cap applies |
| V9 — dual-home a non-event | **PASS** — `find claude/scaffold -name SKILL.md` returns **0**; `priority-is-rank-not-identity.md` copies still **identical** |

## 8. Round 2 — review findings R1/R2/R3/R5 fixed, R4 accepted

Reviewer verdict round 1: **⚠️ Changes requested — 5 defects, none blocking. Codex coverage FULL**
(`codex-cli 0.145.0`, `gpt-5.6-sol`, exit 0). The check that mattered most came back clean: **nothing
was weakened** — joined-line across `HEAD` and the working tree, all four load-bearing phrases
byte-identical in both. Owner ruled on all five, 2026-07-30.

**R1 (medium) — FIXED. The round's real finding, and it was live, not theoretical.** `:154` paraphrased
the authority this task itself cited (`sprint-2.md:279`: *"the top of the **contiguous** open region is
P127"*) and **dropped "contiguous"**. The live board is **not** contiguous — `sprint-2.md:155-159` reads
P123 `✅ Done`, **P124 `🔲 Backlog`**, P125 `✅ Done`, P126 `✅ Done`, P127 `🔲 Backlog`. So *"the highest
open row"* computed to **P124**, and promoting there requires renumbering the closed P125/P126 — **the
exact act the same bullet forbids.** Verified firsthand against the board before changing anything.

**R2 (medium) — FIXED, same sentence, different root cause.** *"Highest"* meant the **largest** number
at `:137` and the **smallest/topmost** at `:155`, eighteen lines apart, with the board's numbering
direction stated nowhere. Codex rated it `high`; the reviewer downgraded to `medium` because bullet 1
self-corrects via *"append"* plus the adjacent insert ban — **the unresolved half was bullet 4**, and an
owner-ruled re-rank is precisely when ranks move.

Both fixed in bullet 4, which now states the direction explicitly (`P1` is the top, larger sits lower),
restores **contiguous**, and adds the operative rule: **"A closed row is a wall, not a step."**

**R3 (low) — FIXED.** `:139` mandated stating the merit position *and why*; the template at `:142`
carried **neither**, so a producer obeying *"use the form"* literally emitted only the flag. The template
now carries both sentences, with *"Both sentences are required — the flag alone does not satisfy this
rule"*, in the relative folder-ID form the live specimens already use (`0164`'s brief: *"On merit this
belongs immediately below `0163`"*).

**R4 (low) — ACCEPTED RESIDUAL** — see §9.

**R5 (low) — FIXED** — see §10.

## 9. Accepted residual from round 2 — R4

- **The cite-by-folder-ID rule shipped unscoped** — *What:* `SKILL.md:164` says *"never cite its board
  rank"* with no scope, where `brief.md:155-156` scoped it to a brief's **reasoning prose**; read
  literally it also forbids the rank-bearing template the same step mandates fourteen lines earlier ·
  *Why (structural):* no wrong action was demonstrated — the context-free reader emitted the template
  without hesitation in both rounds, and the two uses are plainly different acts (stating your own row's
  rank vs. citing another task's). Scoping it precisely is the **citation-form question**, which
  **`0160`** owns as an open investigation. Owner-ruled 2026-07-30 · *Re-raise only if:* a producer is
  observed omitting the rank from the template because of this clause, or `0160` rules a form that
  contradicts it.

## 10. Re-runnable verification recipe (R5) — the commands, not just the results

Recorded because **the plan lived in the driver's session and dies with it**, there is **no `plan.md` on
disk**, and this is the only thing between the task and a re-runnable audit. `0118` just proved the
cost: its folder holds only `brief.md` and `review.md`, **no worklog at all**, so its crash-recovery
account is unverifiable forever.

**Baselines** (capture before editing; the working tree was already dirty with five unrelated entries,
so a naked `git diff --stat` proves nothing):

```sh
cd /Users/mark.dolbyrev/Workspace/fkit
git status --porcelain                                          > /tmp/0157-status-before.txt
/usr/bin/grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md > /tmp/0157-ranks-before.txt
cp claude/skills/fkit-task-brief/SKILL.md                          /tmp/0157-SKILL-before.md
ls -d ai-agents/tasks/done/*/ ai-agents/tasks/cancelled/*/ | wc -l   # 132
```

**V1 — mechanical presence. Sixteen patterns, all `/usr/bin/grep -qF` against `SKILL.md`.**
**Discrimination rule: every pattern must be ABSENT from `/tmp/0157-SKILL-before.md`, and patterns
11–16 must ALSO be absent from the post-round-1 pre-fix copy** — otherwise a fix pattern matches the
wording it was meant to replace and tests nothing.

```
R0-01  A re-rank is the owner's call
R0-02  therefore never re-ranks
R0-03  explicit owner ruling given **in this session**
R0-04  append rank, NOT a merit ranking
R0-05  rows are NEVER renumbered
R0-06  `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered
R0-07  names its authority BEFORE its outcome
R0-08  this is not producer precedent for re-ranking
R0-09  never cite its board rank
R0-10  directly below 0147
R1-11  top of the **contiguous**
R1-12  A closed row is a wall, not a step
R2-13  Ranks count down the board
R2-14  means the **largest number on the board**
R3-15  Both sentences are required
R3-16  On merit this belongs directly below <NNNN>
```

**V2 — anti-regression, joined-line** (the step-5 phrase wraps; a line-oriented grep misses it). Unlike
V1 these MUST pass on every tree — a V2 that fails on the baseline is a mis-escaped pattern, not a
regression:

```sh
J=$(tr '\n' ' ' < claude/skills/fkit-task-brief/SKILL.md)
printf '%s' "$J" | /usr/bin/grep -qF 'append **after** the existing highest priority'
printf '%s' "$J" | /usr/bin/grep -qE '\*\*Do not renumber or +insert into the owner'"'"'s ranking\*\*'
printf '%s' "$J" | /usr/bin/grep -qF '**Never renumber or alter an existing row.**'
printf '%s' "$J" | /usr/bin/grep -qF '**Do not renumber** the owner'"'"'s existing priority ranking'
```

**V3 — context-free reader.** Extract step 5 alone and paste it into a **fresh** subagent with no repo
access and no task context (`sed -n "$(grep -n '^### 5\.' …),$(( $(grep -n '^### 6\.' …) - 2 ))p"`).
Five questions: (1) spawned producer, merit says beside an existing row; (2) owner ruled a promotion in
this session; (3) the **live non-contiguous board** P123 `✅`/P124 `🔲`/P125 `✅`/P126 `✅`/P127–P130 `🔲`,
promote P130 as high as it goes; (4) board runs P1–P144, what rank does an appended brief get;
(5) is the flag line alone enough. Required answers: append + both sentences · yes, authority-first with
four facts · **P127, because P126 is a wall** · **P145** · **no, both sentences**. **Do not self-grade,
and if an answer falls short the fix is the text, not the grader.**

**V5 / V6 — deltas, never absolute counts:**

```sh
git status --porcelain > /tmp/0157-status-after.txt
diff /tmp/0157-status-before.txt /tmp/0157-status-after.txt     # only 0157's own files may appear
/usr/bin/grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md > /tmp/0157-ranks-after.txt
diff /tmp/0157-ranks-before.txt /tmp/0157-ranks-after.txt        # must be empty
ls -d ai-agents/tasks/done/*/ ai-agents/tasks/cancelled/*/ | wc -l   # must still be 132
```

**V7:** `node --test test/*.test.js`   **V9:** `/usr/bin/find claude/scaffold -name 'SKILL.md'` → 0, and
`diff -q` the two `priority-is-rank-not-identity.md` copies → identical.

## 11. Round-2 verification results

| Check | Result |
|---|---|
| V1 discrimination D1 (vs pre-task baseline) | **16/16 ABSENT** — every pattern discriminates |
| V1 discrimination D2 (vs post-round-1 pre-fix copy) | **R0-01–10 present, R1/R2/R3-11–16 ABSENT** — the fix patterns do **not** match the wording they replaced |
| V1 on the fixed file | **16/16 PRESENT** |
| V2 joined-line, three trees | **PASS on all three** — append default + all three prohibitions intact |
| V3 fresh reader, five questions | **5/5 correct**, including P127 with the wall reasoning derived unaided |
| V5 change surface | one source file + this task's own `worklog.md` / `review.md` |
| V6 board untouched | rank sequence identical (145 cells); closed folders 132 → 132 |
| V7 suite | **523 pass, 0 fail** |
| V8 size | 21503 → 23687 → **24395 B**; step 5 8 → 29 → **37 lines** |
| V9 dual-home | scaffold `SKILL.md` count **0**; convention copies identical |

## 12. Residuals

- **Unenforced prose.** Nothing detects a future edit that re-weakens step 5. Accepted per the brief.
- **The board's live addenda are not retro-fitted** to the four-fact authority form. Existing addenda
  are historical records; this task writes the rule going forward and repairs nothing.
- **0158 is still open** — whether a spawn-time instruction may override a skill rule. Deliberately no
  clause about it here; if 0158 rules that skills win, it adds one bullet to this same step.
