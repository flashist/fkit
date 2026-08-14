# Archive Sprint 5 — **move** `ai-agents/sprints/sprint-5.md` into `sprints/done/` and repoint every link

## ID
0294

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-producer

## Context

### Authority

**Owner ruling 2026-08-13**, given live via `AskUserQuestion` in a `fkit lead` session — **the option
label is the verbatim text**: **"Move it — as its own scoped task"**. The owner chose *filing a scoped
task* over doing the archival inline, because the change is far larger than a banner edit looks.

⛔ **This brief does not archive anything.** It records the work. The archival happens when this row is
picked up.

### ⛔⛔ READ THIS FIRST — A BANNER FLIP IS COSMETIC. ONLY THE MOVE CHANGES BEHAVIOR.

Sprint 5 is finished by row status but is **still what `/fkit-status` selects as the active board**.
Flipping `sprint-5.md:3` from `🟢 ACTIVE` to `🔒 CLOSED` **does not change that**, because
**nothing reads the banner**.

**Measured on disk 2026-08-13** (re-measured for this brief, independently of the prior investigation):

```
$ grep -n 'ACTIVE\|CLOSED\|🟢\|🔒' claude/skills/fkit-status/dashboard.sh
114:  # The prefix allowlist is CLOSED and has exactly one entry, `plan-`. An open `.*sprint-<N>` rule
525:# This function has been wrong three times. It is now written as a CLOSED GRAMMAR with ONE code path,
951:      # ⚠️ STRIP THE AGENT-CLOSED QUALIFIER BEFORE THE REASON TEST (task 64, review R3). The ADR-025
```

**Three hits, all unrelated prose comments.** `:114` is a prefix-allowlist comment, `:525` a grammar
comment, `:951` the agent-closed-qualifier strip. **No banner token — not `🟢`, not `🔒`, not the
words `ACTIVE` or `CLOSED` — is read by the dashboard as data.**

Active-sprint selection resolves each candidate's **identity** from its H1/filename across
`ai-agents/sprints/*.md`, and that glob is **non-recursive** — `done/` is never scanned. Measured
2026-08-13:

```
$ bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
⟦fkit-dashboard v1⟧
⟦SELECT⟧
active file="sprint-5.md" identity="Sprint 5"
candidate file="backlog.md" identity="Backlog"
candidate file="sprint-5.md" identity="Sprint 5"
⟦FACTS⟧
⟦END⟧
```

⚠️ **Note the candidate list: `backlog.md` and `sprint-5.md` only.** The four already-archived plans in
`done/` do not appear — direct evidence the glob is non-recursive, and therefore **direct evidence that
the move is the mechanism**.

The lead independently confirmed the banner's irrelevance by experiment: temporarily setting
`sprint-5.md:3` to `🔒 CLOSED — 2026-08-13. TEST` and re-running `select-active` **still** returned
`active file="sprint-5.md" identity="Sprint 5"`. The file was then restored byte-identically
(`cmp`-verified).

⛔ **A close that flips the banner and stops has shipped a no-op.** The banner is the human-readable
half; **the move is the whole functional change.**

### The move's real size — measured 2026-08-13, and LARGER than previously reported

**Outbound, inside `sprint-5.md`** — ⚠️ **the prior figure of "38 `../` links" was an undercount of the
work, in two ways:**

| Link shape | Count | What it must become |
|---|---|---|
| `](../…)` | **39 occurrences on 38 lines** | `](../../…)` |
| `](done/sprint-4.md)` | **6** | `](sprint-4.md)` — both files become siblings inside `done/` |
| `](backlog.md)` | **4** | `](../backlog.md)` |
| `](sprint-5.md)` (self-reference) | **8** | **unchanged** — still self-relative. ⚠️ Verify, do not assume. |
| **Total relative links in the file** | **57** | — |

⚠️ **"38" was a count of *lines*, not occurrences (one line carries two), and it covered only the
`../` shape.** The `done/sprint-4.md` and `backlog.md` links are **the ones a naive `sed 's|](\.\./|](../../|'`
would silently miss** — and they would break in the opposite direction from the ones a reviewer would
think to check. **10 links break if only the `../` shape is rewritten.**

**Inbound, across the repo** — measured 2026-08-13, working tree, excluding `sprint-5.md` itself:

- **53 files** reference `sprint-5.md`
- **177 occurrences**
- **0** of them live in the gitignored `.claude/` generated copies (verified: `grep -rl 'sprint-5.md' .claude` → 0), so **nothing here is a generated file you must not hand-edit**
- Git-tracked subset: **51 files / 173 occurrences**. The two-file gap is `0292` and `0293`, filed today and not yet committed.

⚠️ **Prior figures were 53 files / 183 occurrences.** The file count matches; **the occurrence count
does not** (177 vs 183). Both were measured before/after different edits landed today. ⛔ **Re-derive
again at pickup — do not trust either number.**

Most inbound references are `../../../sprints/sprint-5.md` from closed task briefs under
`ai-agents/tasks/done/`. Concentrations measured today: `0265` and `0266` (4 each), `0252`, `0254`,
`0256`, `0267`, `0264` (3 each), plus `ai-agents/wiki-vault/` (2 files), `ai-agents/knowledge-base/decisions/`
(2 files), `ai-agents/knowledge-base/reports/`, `test/`, `ai-agents/sprints/backlog.md`, and
`ai-agents/sprints/done/sprint-4.md`.

### ⚠️⚠️ THE SILENT BREAKAGE — `done/sprint-4.md`'s successor link

`ai-agents/sprints/done/sprint-4.md` points at Sprint 5 **four times**, all with the `../` prefix that
assumes Sprint 5 sits one level up. Measured 2026-08-13:

```
3:> ## 🔒 CLOSED — 2026-08-10. Superseded by [Sprint 5](../sprint-5.md).
30:> byte-identical; the reason is restated in [Sprint 5](../sprint-5.md)'s banner.
54:> Archiving it before [Sprint 5](../sprint-5.md) opens is what keeps exactly **one** `sprint-*.md` in
60:> historical. Do not pick up work from this file; see [Sprint 5](../sprint-5.md).
```

**All four break the moment Sprint 5 moves into `done/`**, and they break *silently* — nothing in the
suite resolves a markdown href. Each must become `](sprint-5.md)`. ⛔ **Repairing them is part of this
task, not a follow-up.**

⚠️ **`:54` is a prose claim, not just a link.** It asserts *"Archiving it before Sprint 5 opens is what
keeps exactly **one** `sprint-*.md` in …"* — read the full sentence at pickup and judge whether the
claim survives the move (after this task, `ai-agents/sprints/` holds `backlog.md` and no `sprint-*.md`
at all). ⛔ If it does not survive, **report it — do not silently rewrite history in a closed plan.**

### ⚠️ `/fkit-task-done` does NOT do this for you

`/fkit-task-done`'s href-repair duty covers links that break when a **task folder** moves between
`backlog/` and `done/`. It has **no knowledge of sprint plans** and will not repair a single one of the
53 inbound references or the 57 outbound ones. ⛔ **Do not assume a skill handles the link work. There
is no mover for a sprint plan — this is a hand-performed move plus a hand-performed sweep.**

### ⚠️ OPEN QUESTION FOR THE OWNER — the banner has no precedent for this case

> ⚠️ **ANSWERED 2026-08-13 — SETTLED. See the dated ruling block at the end of this brief**
> (*"✅ OWNER RULINGS — 2026-08-13"*). **Verbatim owner label: "Omit the successor clause"** — which is
> shape **(a)** below. ⛔ **Do not re-put this question to the owner.** Everything below is kept
> **answered, not deleted**, so the reasoning that produced the question survives.

All four archived plans name a successor. Measured 2026-08-13:

```
done/sprint-1.md:3 > ## 🔒 CLOSED — 2026-07-11. Superseded by [Sprint 2](sprint-2.md).
done/sprint-2.md:3 > ## 🔒 CLOSED — 2026-08-06. Superseded by [Sprint 3](sprint-3.md).
done/sprint-3.md:3 > ## 🔒 CLOSED — 2026-08-07. Superseded by [Sprint 4](sprint-4.md).
done/sprint-4.md:3 > ## 🔒 CLOSED — 2026-08-10. Superseded by [Sprint 5](../sprint-5.md).
```

Every one was archived **at rollover into the next sprint**, so a successor always existed.
**There is no Sprint 6, and none is being opened.**

⛔ **Archiving with no successor has no precedent on disk, so the banner wording is an OWNER CALL.**
This brief deliberately **does not pick one**. Shapes on the table:

- **(a)** Omit the `Superseded by` clause entirely — `🔒 CLOSED — YYYY-MM-DD.` plus the archival
  authority.
- **(b)** Keep the clause and add `Superseded by [Sprint 6](sprint-6.md)` **later**, when Sprint 6
  exists — which means shipping a **dangling link today**. ⛔ Not recommended without an explicit
  ruling.
- **(c)** Something else — e.g. an explicit *"No successor board; the next sprint had not been opened
  at archival"* sentence, which states the unprecedented fact rather than hiding it.

⚠️ **Do not start the banner edit until the owner has ruled.** The move and the link sweep can be
scoped and reviewed without it, but the banner's final text cannot be written without a ruling.

⚠️ Also note the four precedent banners record the **archival authority** in the paragraph below the
banner line (e.g. `sprint-3.md`: *"Sprint 3 was archived by OWNER RULING, 2026-08-07, given via
`AskUserQuestion` in a live session"*). **Follow that form** — the 2026-08-13 ruling above is what
authorizes this archival and belongs in the archived file's own record.

## What to build

**One file moves. Everything that points at it, in either direction, is repointed.**

1. **Re-derive every figure in this brief before touching anything.** ⚠️ It was written 2026-08-13
   while other agents were editing `sprint-5.md`. **State explicitly, in both directions, where what
   you measure differs from what is written above.**

2. **Get the owner's banner ruling** (see the open question above). ⛔ Do not choose a shape yourself.

3. **Flip the banner** at `sprint-5.md:3` to the ruled wording, and add the archival-authority
   paragraph in the form the four precedents use.

4. **Move the file**: `ai-agents/sprints/sprint-5.md` → `ai-agents/sprints/done/sprint-5.md`.
   ⚠️ **Use `git mv`** so the history follows.

5. **Rewrite the outbound links inside the moved file — all four shapes, not one.** See the table
   above. ⛔ **A single `sed` on `](../` is wrong and breaks 10 links.** Handle each shape explicitly
   and verify the self-references genuinely need no change.

6. **Repair `done/sprint-4.md`'s four `](../sprint-5.md)` links** → `](sprint-5.md)`. Read `:54`'s full
   sentence and judge whether its prose claim survives; **report rather than rewrite** if it does not.

7. **Sweep all inbound references.** Every path pointing at `sprints/sprint-5.md` gains a `done/`
   segment. ⚠️ **Enumerate the full list first and repair against that list** — the depths vary
   (`../../../sprints/…` from task briefs, `sprint-5.md` from `backlog.md`, others from the vault and
   knowledge-base).

### ⛔ Constraints

- ⛔ **Do NOT open Sprint 6.** Not in scope, not implied, not a prerequisite.
- ⛔ **Do NOT reconcile `sprint-5.md`'s internal prose.** A **separate producer pass is already handling
  that**. Your edits to the file are the banner, the archival-authority paragraph, and link paths —
  **nothing else**.
- ⛔ **Do NOT run a general link audit.** If you find a broken link unrelated to Sprint 5's move,
  **report it as a finding; do not fix it here.**
- ⚠️ **`ai-agents/wiki-vault/` holds 2 referencing files. ⛔ You do not write them**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  Route them to `fkit-wiki`, or file a wiki re-sync row following the `0238` / `0263` precedent. **Say
  which you did** — an unrepaired vault link left unmentioned is a silent failure.
- ⛔ **Do NOT edit closed task briefs' *content*.** Repairing a path inside a closed brief is a path
  repair; rewriting its prose is not.
- ⛔ **No re-rank** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ **No commit, no push.**

## Verification steps

Each step is a runnable command. **Paste the command and its output; do not assert.**

1. **⭐ THE ONE CHECK THAT PROVES THE MOVE DID ANYTHING** — Sprint 5 is no longer selected:
   ```
   bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
   ```
   ⛔ **`sprint-5.md` must NOT appear** — not as `active`, not as a `candidate`. Expect `backlog.md`
   as the only candidate and **no active sprint**.
   ⚠️ **If `sprint-5.md` still appears, the task has failed regardless of how the banner reads.**

2. **The archived plan still parses cleanly at its new path:**
   ```
   bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/done/sprint-5.md
   ```
   Expect `⟦FACTS⟧` with **`total 17`** and **`count done 17`**.
   ⛔ **No `drift` line. ⛔ No `⟨derive: UNPARSEABLE⟩`.** Paste the whole `⟦FACTS⟧` block.

3. **The old path is gone and the new one exists:**
   ```
   ls ai-agents/sprints/
   ls ai-agents/sprints/done/
   git status --porcelain | grep sprint-5
   ```
   Expect no `sprint-5.md` in `ai-agents/sprints/`, one in `done/`, and a rename (`R`) in git status.

4. **⭐ EVERY inbound reference resolves — ENUMERATED, NOT SPOT-CHECKED.**
   ⚠️ **A three-location spot-check cannot see a partial repoint. This project has been bitten by
   exactly that.** Resolve every markdown link that targets Sprint 5, from its own file's directory:
   ```
   grep -rn 'sprint-5\.md' ai-agents claude test README.md 2>/dev/null \
   | grep -oE '^[^:]+:[0-9]+:.*\]\(([^)]*sprint-5\.md)\)' \
   | sed -E 's#^([^:]+):([0-9]+):.*\]\(([^)]*sprint-5\.md)\)#\1 \2 \3#' \
   | while read -r f ln tgt; do
       d=$(dirname "$f")
       if [ -e "$d/$tgt" ]; then echo "OK    $f:$ln -> $tgt"; else echo "BROKEN $f:$ln -> $tgt"; fi
     done | sort | uniq -c
   ```
   ⛔ **Expect ZERO `BROKEN` lines.** Paste the full output, not a summary.
   ⚠️ If a link uses an anchor (`sprint-5.md#…`) or a non-`](…)` form, the one-liner will miss it —
   **check for those separately and say what you found:**
   ```
   grep -rn 'sprint-5\.md' ai-agents claude test README.md | grep -v '](' | grep -v '^Binary'
   ```

5. **Every outbound link inside the moved file resolves:**
   ```
   cd ai-agents/sprints/done && \
   grep -oE '\]\([^)]+\)' sprint-5.md | sed 's/^](//; s/)$//' | grep -vE '^(http|#)' | sed 's/#.*//' \
   | sort -u | while read -r t; do [ -e "$t" ] && echo "OK    $t" || echo "BROKEN $t"; done
   ```
   ⛔ **Zero `BROKEN`.** ⚠️ Compare the count against the **57** relative links measured at filing (or
   whatever you re-derive at step 0) — **a shrinking count means links were dropped, not fixed.**

6. **`done/sprint-4.md`'s four successor links are repaired:**
   ```
   grep -n 'sprint-5' ai-agents/sprints/done/sprint-4.md
   ```
   ⛔ **No `](../sprint-5.md)` may remain.** Expect four `](sprint-5.md)`. Then confirm they resolve —
   step 4 covers this, but paste this file's lines explicitly since it is the known silent breaker.

7. **The banner reads the ruled wording, and nothing else in the file's prose moved:**
   ```
   sed -n '1,12p' ai-agents/sprints/done/sprint-5.md
   git diff -M -- ai-agents/sprints/done/sprint-5.md | grep '^[-+]' | grep -v '^[-+][-+][-+]' | head -80
   ```
   ⚠️ Expect changed lines **only** in the banner block and in link paths. ⛔ **Any prose diff outside
   those is out of scope** — the separate producer pass owns `sprint-5.md`'s prose.

8. **Nothing unexpected changed:**
   ```
   git status --porcelain
   ```
   ⛔ **Nothing under `ai-agents/wiki-vault/`.** ⛔ Nothing under `claude/`.

9. **The suite is still green, and say what that does and does not prove:**
   ```
   npm test
   ```
   ⚠️ **No test resolves a markdown href.** Green proves the move broke no test; it proves **nothing**
   about whether 53 files' links resolve. **Step 4 is the only evidence for that, and the close must
   say so.**

10. **Nothing committed, nothing staged:**
    ```
    git log --oneline -1 && git diff --cached --stat
    ```
    Expect the staged diff **empty**.

## Notes

- **Why Backlog / Unscheduled.** ⚠️ Stated precisely: **`ai-agents/sprints/sprint-5.md` carries 17
  status rows, all 17 reading `✅ Done` — zero open rows — but the plan is NOT marked closed** (`:3`
  still reads `🟢 ACTIVE`) **and it is still what `select-active` returns**. So there is no open sprint
  to file into, and Backlog is where an unsprinted brief lands by construction. ⛔ **Filed by a spawned
  producer with no owner channel, so it is UNRANKED and re-ranks nothing**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  The owner ranks it whenever they next touch the board.
- **⚠️ On merit this is arguably more urgent than "unscheduled" suggests**, and the flag belongs here
  rather than in a rank: **until it lands, every `/fkit-status` run reports a finished board as the
  active sprint.** That is a live, daily wrong answer, not a latent docs defect. ⛔ **That is an
  argument for the owner to weigh, not a rank this brief may set.**
- **Owner is `fkit-producer`** — sprint plans and the task lifecycle are the producer's. ⚠️ The link
  sweep is mechanical file editing, but the **banner wording, the archival-authority paragraph, and the
  judgement call on `sprint-4.md:54`'s prose claim** are all plan-authorship, which is why this is not
  a coder row.
- **⚠️ The banner ruling is a hard prerequisite** for step 3, and only for step 3. Steps 4–7 (the move
  and the link sweep) are fully scoped today. A pickup that stalls waiting on the ruling should say so
  rather than guessing.
- **Precedent to follow for the archival-authority paragraph**: `done/sprint-2.md:3-5`,
  `done/sprint-3.md:3-5`, `done/sprint-4.md:3-5`. ⚠️ **Precedent for the banner's `Superseded by`
  clause does NOT exist for this case** — see the open question.
- **Related, deliberately NOT folded in:**
  - `0236` (*sweep the stale Sprint 2 prose paths after the archival*) and `0238` / `0263` (wiki
    re-syncs after the Sprint 2 and Sprint 4 archivals) are the **precedent shape** for the follow-on
    work an archival generates. ⚠️ **Read them before starting** — they show what the last two
    archivals left behind. ⛔ They are not this row's scope.
  - The vault re-sync this archival will owe is **`fkit-wiki`'s**, filed separately (the `0263`
    precedent). ⛔ Do not do it here.
- **⛔ What this row does NOT do:** it does not open Sprint 6, does not reconcile `sprint-5.md`'s
  internal prose (a separate producer pass owns that), does not audit links unrelated to Sprint 5, and
  does not write `ai-agents/wiki-vault/`.

---

## ✅ OWNER RULINGS — 2026-08-13. Appended after filing; nothing above was changed.

⛔ **This block is an APPEND.** Every byte above it is exactly as filed. The section
*"⚠️ OPEN QUESTION FOR THE OWNER — the banner has no precedent for this case"* above is
**answered, not deleted** — it is kept verbatim so the reasoning that produced the question survives.
⛔ **A planner must read that section together with this block, and must not re-put either question to
the owner.**

### ✅ RULING 1 — the banner wording. SETTLED. Closes the open question above.

| | |
|---|---|
| **Date** | 2026-08-13 |
| **Channel** | `AskUserQuestion`, put to the owner in a live `fkit lead` session |
| **Question** | What should Sprint 5's `🔒 CLOSED` banner say, given that all four archived precedents read `🔒 CLOSED — <date>. Superseded by [Sprint N+1](…)` because each was archived **at rollover**, and **there is no Sprint 6**? |
| **Chosen — verbatim option label** | **"Omit the successor clause"** — i.e. shape **(a)** in the open question above |

**The banner line becomes exactly:**

```
> ## 🔒 CLOSED — 2026-08-13.
```

**The date and nothing more. ⛔ No `Superseded by …` clause.**

⚠️ The archival-authority paragraph below the banner line is **unaffected by this ruling** — it is
still written, in the form the four precedents use (`done/sprint-2.md:3-5`, `done/sprint-3.md:3-5`,
`done/sprint-4.md:3-5`). What is omitted is the successor clause on the banner line itself, not the
authority record.

**The owner's stated reasoning, recorded so the omission is not later read as an oversight against four
precedents:**

- It is **honest** — there is no successor to name.
- It **breaks no link.** Shape **(b)** above would have shipped a dangling `[Sprint 6](sprint-6.md)`
  pointer to a file that does not exist — **inside the very change whose entire purpose is repointing
  links correctly.**
- It **reads correctly whenever Sprint 6 eventually opens.** Nothing needs revisiting then.
- It **departs from precedent only by omission**, not by inventing a new form.

⛔ **What this ruling does NOT do.** It does **not** establish that future archives omit the clause.
The four precedents were archived **at rollover** and each named a real successor; **that remains the
normal case.** This is the **no-successor case, ruled on its own facts.**
⛔ **Do not write this up as a general convention, in this brief or anywhere else.**

⚠️ Consequence for the brief above: *"What to build"* step **2** (*"Get the owner's banner ruling"*) is
**already satisfied** — do not re-ask it. Step **3** may now be executed. The *"Notes"* line calling the
banner ruling *"a hard prerequisite"* is **discharged**; nothing in this task is now blocked on an owner
decision.

### ✅ RULING 2 — the board placement. SETTLED. Do not re-open.

| | |
|---|---|
| **Date** | 2026-08-13 |
| **Channel** | `AskUserQuestion`, same live `fkit lead` session |
| **Question** | Should `0294` be ranked/pulled forward, given the urgency argument the filing producer surfaced? |
| **Chosen — verbatim option label** | **"Leave unranked for now"** |

**`0294` stays `🔲 Backlog` / `Unscheduled`.** ⛔ No re-rank
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

**The argument the filing producer surfaced but deliberately did not weigh, and that the owner has now
weighed:** *until `0294` lands, every `/fkit-status` run reports a finished board as the active
sprint* — a **live daily wrong answer, not a latent docs defect** (see the second *"Notes"* bullet
above). **The owner heard that argument and still chose unranked**, on the reasoning that
`ai-agents/sprints/backlog.md` is **a flat board by design**, and `0294` can be pulled into the next
sprint whenever one is scoped — **which is also the moment the successor-clause question would have
resolved itself anyway.**

⛔ **Do not re-open this.** A planner that rediscovers the `/fkit-status` urgency argument is
rediscovering a fact the owner already ruled on.
