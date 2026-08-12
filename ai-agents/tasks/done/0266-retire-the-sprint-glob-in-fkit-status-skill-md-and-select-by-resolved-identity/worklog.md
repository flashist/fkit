# Worklog — task 0266

Retire the `sprint-*.md` glob in `claude/skills/fkit-status/SKILL.md`; select the active sprint by
resolved identity via `dashboard.sh select-active`.

## Session

**2026-08-12 — Build worker** (`fkit-coder` spawn, under the `/fkit-sprint-ship-loop`
declared-approval marker; owner approved `plan.md` the same day via `AskUserQuestion` in the driver
session).

Bounded unit of work: implement the approved plan. Verification is a separate spawn.

### Pre-flight

Confirmed the plan pointer before editing: `git hash-object plan.md` →
`b55ebd6746ff3c520dfb128e8bdbb741484ae140`, `wc -c` → `10042`. Both match the pointer declared in the
spawn prompt. **Caveat carried forward from the prompt:** this check is self-computed and
self-reported — no hook verifies it for task 0266 until 0204's carry-check hook lands.

Confirmed all three edit sites were byte-exact against the plan's "Replace:" blocks before touching
them (`:26-28`, `:47-50`, `:189-190`).

### What changed

One file: `claude/skills/fkit-status/SKILL.md`. All three edits applied **verbatim** from the
approved plan — no wording of my own was introduced at any site.

- **Edit 1** (`:26-28` → now `:26-49`) — the empty-argument rule. The glob is replaced by a
  `dashboard.sh select-active ai-agents/sprints` call plus a reader's guide to its four answer
  shapes (`active file=…`, `candidate file=…`, `drift ambiguous-active-sprint …`, `active none`).
  Carries ADR-041 §1.1, §1.3, §1.5, §1.6 as reader duties; delegates §1.2 and §1.4 to the script.
- **Edit 2** (the `Backlog`-is-a-target block) — conclusion kept, mechanism swapped from "outside the
  glob" to "identity is `Backlog`, never eligible", with ADR-041 §3's "stronger, not weaker" recorded.
- **Edit 3** (step 4's `:189-190`) — the sentence "it does not resolve sprints … resolving stays
  yours", which Edit 1 falsified, repaired to scope the claim to *this* invocation and point at the
  `select-active` call. Owner-ruled IN at the plan gate.

Per owner ruling 3, the ordering rule is stated **outcome-only** ("it has already ordered … and taken
the highest") — no comparison rule and no suffix bound in prose. Per owner ruling 4, the optional
grep-guard test was **not** built.

### Sanity checks run (not the full 7-step verification)

- `grep -n 'sprint-\*' SKILL.md` → **empty**, exit 1. The glob is gone from the file.
- `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` → exit 0,
  `active file="sprint-5.md" identity="Sprint 5"`, with `backlog.md` listed as a candidate resolving
  to `Backlog`. Matches the shape Edit 1 documents.
- Cross-checked all four documented answer tokens against the script's actual `printf` calls
  (`dashboard.sh:272, 275, 282, 292`) — every token matches character-for-character.
- Grepped for a leaked second grammar (`Sprint [0-9]`, `plan-`, segment/delimiter wording). Two hits,
  **both pre-existing and neither a grammar**: `:206` is step 4's placeholder
  `<path-to-the-sprint-plan-you-resolved-in-step-1>`, `:321` is the pre-existing
  `drift unresolved-plan-sprint` record documentation.

**Not run here, deliberately:** `npm test`, the scratchpad fixture exercising the reporter's §7 names
(plan step 3), and the full grep set. Those are the verification spawn's job.

### Diff scope

`git diff --stat` shows three paths. Only **one** is mine:

- `claude/skills/fkit-status/SKILL.md` — +35/-11. **This is my entire change surface.**
- `ai-agents/sprints/sprint-5.md` and `.../0266…/brief.md` — **pre-existing driver edits**, already
  modified in the working tree when this spawn started (confirmed by `git status` before my first
  edit). I did not touch either.
- `plan.md` is untracked and was **not** re-authored.

Nothing committed or pushed. Nothing written under `ai-agents/wiki-vault/`.

## Decision log — decisions taken autonomously

**none.**

No fix was applied without asking beyond the approved plan's own text, and no obvious-winner call was
made. All three edits, including Edit 3, were explicitly owner-ruled at the plan gate and applied
verbatim; the two items I might otherwise have had to judge (prose ordering treatment, grep-guard
test) were both settled by owner rulings 3 and 4. Nothing fell outside the approved plan, so nothing
required a `NEEDS-DECISION` return.

## Surfaced, not built

The grep-guard test asserting `SKILL.md` never regains `sprint-*.md` — owner-ruled out for this task
(ruling 4), recorded here so it stays findable if the guard is wanted later.

---

## Session

**2026-08-12 — Verify worker** (`fkit-coder` spawn under the `/fkit-sprint-ship-loop`
declared-approval marker). Bounded unit of work: **verification only.** No feature work; nothing was
fixed, because nothing verified broken.

**Result: all seven verification steps PASS.** Change surface of this spawn: **this worklog section
only.** No source file was touched, nothing committed or pushed, no `ai-agents/wiki-vault/` write.

### Pre-flight

`git hash-object plan.md` → `b55ebd6746ff3c520dfb128e8bdbb741484ae140`, `wc -c` → `10042`. Both match
the pointer in the spawn prompt. **Same caveat as the Build session:** self-computed and
self-reported — no hook verifies it until 0204's carry-check lands.

### Step 1 — the interface exists; the two `identity` calls — PASS

```
$ bash claude/skills/fkit-status/dashboard.sh identity ai-agents/sprints/sprint-5.md
Sprint 5                                                                    (exit 0)
$ bash claude/skills/fkit-status/dashboard.sh identity ai-agents/sprints/backlog.md
Backlog                                                                     (exit 0)
```

### Step 2 — the rewritten rule on this repo — PASS

The exact invocation the rewritten `:26` now tells the reader to use, run **verbatim as written**
(`.claude/…` reader-facing path):

```
$ bash .claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
⟦fkit-dashboard v1⟧
⟦SELECT⟧
active file="sprint-5.md" identity="Sprint 5"
candidate file="backlog.md" identity="Backlog"
candidate file="sprint-5.md" identity="Sprint 5"
⟦FACTS⟧
⟦END⟧
                                                                            (exit 0)
```

Selects `sprint-5.md`; `backlog.md` is listed as a candidate resolving to `Backlog` and is **not**
eligible. Identical output from the canonical `claude/…` path.

### Step 3 — the reporter's §7 names, as a real fixture — PASS

The brief asked for a **desk check**; run instead as a live fixture, which is strictly stronger. Built
in the **scratchpad** (never in the repo, never under `ai-agents/`): the **seven top-level** names from
the §7 table of
`ai-agents/knowledge-base/reports/fkit-dashboard-plan-sprint-resolution-defect-2026-08-10.md`, each
with its **verbatim** H1 extracted mechanically from that table (not retyped). The five `done/` rows
were excluded — `select-active` is depth-1 by construction.

**Real output, pasted:**

```
$ bash claude/skills/fkit-status/dashboard.sh select-active <scratchpad>/s7-fixture/sprints
⟦fkit-dashboard v1⟧
⟦SELECT⟧
active file="plan-sprint-6.md" identity="Sprint 6"
candidate file="backlog.md" identity="Backlog"
candidate file="plan-index.md" identity="unresolved"
candidate file="plan-sprint-4.md" identity="Sprint 4"
candidate file="plan-sprint-4c.md" identity="Sprint 4c"
candidate file="plan-sprint-5.md" identity="Sprint 5"
candidate file="plan-sprint-6.md" identity="Sprint 6"
candidate file="sprint-backlog.md" identity="Backlog"
⟦FACTS⟧
⟦END⟧
                                                                            (exit 0)
```

**Agrees with ADR-041's stated outcome exactly** — `plan-sprint-6.md` selected, **not**
`sprint-backlog.md` (which resolves to `Backlog`, never eligible). `plan-index.md` resolves
`unresolved` and is correctly listed rather than silently dropped. `Sprint 4c` sorted below
`Sprint 6`. **No finding against 0265.**

### Step 4 — the glob is retired — PASS

```
$ grep -n 'sprint-\*\.md' claude/skills/fkit-status/SKILL.md     -> no output (exit 1)
$ grep -n 'sprint-\*'     claude/skills/fkit-status/SKILL.md     -> no output (exit 1)
```

**ADR-041 §6's completeness claim holds for this file.** Baseline at `HEAD` had exactly two glob
sites — `:26` and `:48`, §6's sites 1 and 2 — and no third. **No eighth site to report.**

### Step 5 — no second grammar — PASS

```
$ grep -nE 'Sprint \[0-9\]|Sprint <N>|\[0-9\]\+|\[a-z\]'   SKILL.md   -> no output (exit 1)
$ grep -niE 'suffix|single letter'                          SKILL.md   -> no output (exit 1)
$ grep -n  'plan-'                                          SKILL.md   -> 2 hits
$ grep -niE 'delimiter|segment|token|allowlist|prefix'      SKILL.md   -> 5 hits
```

**Every one of those 7 hits is pre-existing and none is the identity grammar** — verified two ways:
counts are identical at `HEAD` and in the worktree, and a grep over the diff's **added lines only**
returns nothing for any of these patterns (exit 1). For the record: the `plan-` hits are `:206`'s
placeholder `<path-to-the-sprint-plan-you-resolved-in-step-1>` and `:321`'s pre-existing
`drift unresolved-plan-sprint` record; the others are the task-status marker prefix, the
`(agent-closed — …)` marker, and the `key="value"` FACTS grammar. **No segment-delimiter list, no
`Sprint <N>`-shaped pattern, no `plan-` allowlist, no suffix bound.**

### Step 6 — `npm test` — PASS

Full suite, `node --test` via `npm test`, zero devDependencies (ADR-014). **Explicit exit code 0.**

```
ℹ tests 709
ℹ pass 709
ℹ fail 0
ℹ cancelled 0 / skipped 0 / todo 0

✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

**Carrying the Build/plan caveat forward, undiluted:** no test asserts this file's body
(`dashboard-contract.test.js:2484` records SKILL.md prose as LLM-executed and untestable). `npm test`
here is a **regression guard, not evidence the edit is correct.** Steps 2-5 are that evidence.

### Step 7 — diff scope — PASS

```
$ git diff --stat
 ai-agents/sprints/sprint-5.md                      |  2 +-
 .../0266…/brief.md                                 |  2 +-
 claude/skills/fkit-status/SKILL.md                 | 42 +++++++++++++++++-----
 3 files changed, 35 insertions(+), 11 deletions(-)

$ git status --porcelain
 M ai-agents/sprints/sprint-5.md                     (driver: 🔄 In progress)
 M .../0266…/brief.md                                (driver: 🔄 In progress)
 M claude/skills/fkit-status/SKILL.md                (build: the task's one file)
?? .../0266…/plan.md                                 (driver-written)
?? .../0266…/worklog.md                              (build-written, appended here)
```

**Exactly the sanctioned set; no additional path.** `claude/skills/fkit-status/SKILL.md` is the only
source file changed. **No scope violation.**

### Extra check not in the brief — the diff is the approved plan, verbatim

Mechanically confirmed rather than taken on trust: **every added line of the diff appears verbatim in
`plan.md`** (`grep -Fqx` over each added line — zero misses). Every removed line likewise, with the
single expected exception of Edit 3's two-line target, which `plan.md` quotes as one wrapped
blockquote at `:93` so a line-exact match cannot hit. **No wording outside the approved plan entered
the file.**

### Observation — not a defect, and deliberately not fixed here

The **gitignored** `.claude/skills/fkit-status/SKILL.md` install copy is **stale** — it still carries
the old glob at its `:26` and `:48`. Expected, and the plan's second caveat already says the refresh
(`claude/fkit-claude-init.sh .`) is not part of the diff. **Consequence worth stating plainly: until
that refresh is run, a `/fkit-status` in *this* dogfooding repo still executes the retired glob
prose.** Left alone on purpose — refreshing is outside a verification-only remit, and nothing verified
broken. `dashboard.sh` itself is byte-identical between the two homes.

> **Closed by the Process-review session below** — the owner ruled the refresh IN on 2026-08-12 and it
> has now been run. The install copy is no longer stale.

---

## Session

**2026-08-12 — Process-review worker** (`fkit-coder` spawn under the `/fkit-sprint-ship-loop`
declared-approval marker). Bounded unit of work: apply the `fkit-process-stateful-review` **method**
against this task folder's `review.md` — verify R1 and R2, classify, write the *Coder response*
section, and apply the fixes the owner's two post-review rulings authorise.

**Result: both findings verified and fixed. No `NEEDS-DECISION` was needed** — nothing fell outside
the approved plan once the two rulings were folded in.

### Owner rulings folded in (relayed by the driver, not re-asked)

1. **R2 — "Clause in Edit 1 only (Recommended)."** Distinguish `active none`/exit 3 from a real
   failure/exit 1 **inside Edit 1's block only**. `#### If the script fails` left byte-identical; the
   fourth edit site was declined and is now a recorded accepted residual in `review.md`.
2. **"Yes — run fkit-claude-init.sh . (Recommended)."** Refresh the gitignored `.claude/` install copy
   after the source edits land.

### What changed

- `claude/skills/fkit-status/SKILL.md` — **two clauses, both inside Edit 1's block:**
  - **`:39-41` (R1)** — the `active` bullet now states that **`file=` is a basename, not a path**, and
    that it must be joined to the `ai-agents/sprints` argument before being passed to step 4.
  - **`:50-54` (R2)** — a clause stating that **`active none` exits 3 and is an answer, not a
    failure**, that a real failure exits 1 and prints no `⟦SELECT⟧` block, and that **step 4's
    hand-build fallback does not apply to this call**.
- `ai-agents/tasks/backlog/0266-…/review.md` — the *Coder response* section (mine) and two
  *Accepted residuals* entries. The reviewer's *Reviewer findings* rows were **not** edited; one
  non-substantive line-cite correction (R2's `:53` was `:49`) is recorded in my section instead.
- `ai-agents/tasks/backlog/0266-…/worklog.md` — this section.
- **`.claude/` (gitignored)** — refreshed via `bash claude/fkit-claude-init.sh .` (ruling 2): "refreshed
  7 agents, 26 skills", exit 0. `diff claude/skills/fkit-status/SKILL.md .claude/skills/fkit-status/SKILL.md`
  → **identical**; `grep -n 'sprint-\*' .claude/…/SKILL.md` → **empty**. **It does not appear in
  `git status --porcelain` or `git diff --name-only`** — both greps for `.claude/` return **0**.

### Evidence gathered this round

- **R1 measured:** `dashboard.sh:243` builds each record with `basename "$_f"`; `:272` emits it. Running
  the old prose literally — `bash claude/skills/fkit-status/dashboard.sh sprint-5.md` →
  `dashboard.sh: no such sprint plan: sprint-5.md`, **exit 1**.
- **R2 measured:** a scratchpad `sprints/` holding only `backlog.md` → `active none` + the full
  candidate list, **exit 3**; a nonexistent dir → `die`, **exit 1**. Source: `dashboard.sh:296-297`
  vs `die()` at `:55`. `test/dashboard-contract.test.js:2618` (S5) already pins exit 3.
- **Owner ruling 1 held:** `#### If the script fails` … `### 5. Report` **diffs byte-identical against
  `HEAD`**.
- **ADR-041 §5 still passes:** `grep -nE 'Sprint \[0-9\]|plan-[a-z]*\*|allowlist|segment|delimiter|suffix'`
  over `SKILL.md` → **empty**. `grep -n 'sprint-\*'` → **empty**.
- **Diff scope:** `git diff -U0` shows exactly **three** hunks — `@@ -26 +26 @@`, `@@ -47 +73 @@`,
  `@@ -189 +217 @@`. No fourth edit site.
- **`npm test` post-fix — green, exit 0.** `node --test`: **tests 709 / pass 709 / fail 0 / cancelled 0
  / skipped 0 / todo 0**; `test/prove-red.sh`: **`✓ hard gate PASSED — real + unmutated copy green;
  each mutation reds its NAMED assertion.`** **Same caveat as the Verify session, undiluted:** no test
  asserts this file's body, so this is a **regression guard, not evidence the two clauses are
  correct** — the measured `dashboard.sh` runs above are that evidence.
- **`git status --porcelain` after the `.claude/` refresh** — unchanged from before it: three modified
  tracked paths (`sprint-5.md`, `brief.md`, `SKILL.md`) and three untracked task-folder files
  (`plan.md`, `review.md`, `worklog.md`). **Zero `.claude/` entries** in `git status --porcelain` and
  zero in `git diff --name-only`.

## Decision log — decisions taken autonomously (Process-review session)

Two fixes applied without a per-fix owner approval, under the sprint-loop carve-out
([ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
Decision 3 + its 2026-07-22 autonomy amendment; discipline per
[ADR-019](../../../knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)).
**No obvious-winner call was made** — both edits were authorised in shape by an owner ruling, so
neither required me to pick between competing options.

1. **Answers R1.** **Changed:** `claude/skills/fkit-status/SKILL.md:39-41` — added *"**`file=` is a
   basename, not a path** — join it to the `ai-agents/sprints` you passed in, and pass *that* to step
   4."* to the `active file=` bullet. **Why it qualified:** verified **CORRECT** against source
   (`dashboard.sh:243` `basename`, `:272` emit) **and** reproduced as a measured exit-1 failure;
   **mechanical and localized** (one clause, one bullet, no new mechanism, no `dashboard.sh` change);
   **inside the approved plan** — the bullet is part of Edit 1's replacement block, and the plan scopes
   this file and that block. Severity assigned by me: **medium**, concurring with the reviewer after
   re-tracing — the failure is loud (`die`, exit 1) and yields no wrong board.

2. **Answers R2.** **Changed:** `claude/skills/fkit-status/SKILL.md:50-54` — a clause stating exit 3 is
   an answer not a failure, exit 1 is the real failure with no `⟦SELECT⟧` block, and step 4's
   hand-build fallback does not apply to this call. **Why it qualified:** verified **PARTIALLY
   CORRECT** with measured exit codes on both branches; **mechanical and localized** (one clause in
   the block Edit 1 already rewrote); **inside the approved plan**, and its shape was fixed by the
   owner's post-review ruling *"Clause in Edit 1 only"* — which is also why the second locus
   (`#### If the script fails`) was **left byte-identical** rather than judged by me. Severity assigned
   by me: **low**, concurring — `:47-48`'s `active none` bullet fires before step 4 is reachable.

**Nothing was returned as `NEEDS-DECISION`**: no frontier-move, no regression, no severity dispute
that changed scope, no broad or behavior-changing fix, and nothing outside the approved plan. The one
item that *would* have been a judgment call — whether to also edit `#### If the script fails` — was
removed from my discretion by owner ruling 1 and recorded as an accepted residual instead.

**Not committed, not pushed. No `ai-agents/wiki-vault/` write. `plan.md` not re-authored. The driver's
edits to `ai-agents/sprints/sprint-5.md` and `brief.md` were not touched.**

---

## Session — RE-VERIFY worker (post-R1/R2), 2026-08-12

Spawned by `/fkit-sprint-ship-loop` as the **re-verify worker**. **Verification only** — no
implementation, no fix, no commit, no push, no `ai-agents/wiki-vault/` write, `plan.md` not
re-authored. Nothing in the repo was modified by this session except this appended section.

**Result: all 7 checks PASS.** Both review fixes verified **correct as written, by measurement** —
not by reading the claims above.

### Check 1 — `npm test` — PASS

Full suite, run fresh this session. **Exit code 0.**

```
ℹ tests 709
ℹ suites 17
ℹ pass 709
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

`test/prove-red.sh` hard gate, same run:

```
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

All 15 mutations reddened their named assertion; all 9 baselines (0a–0i) green.

### Check 2 — the glob is retired — PASS

```
$ grep -n 'sprint-\*' claude/skills/fkit-status/SKILL.md
exit=1   (no match)

$ grep -n 'sprint-\*\.md' claude/skills/fkit-status/SKILL.md
exit=1   (no match)
```

### Check 3 — no second grammar (ADR-041 §5) — PASS

Run **scoped to the added lines only** (`git diff -U0 | grep '^+'`), so the answer is about what the
two new clauses introduced, not about pre-existing prose:

```
  PASS  no match: /Sprint \[0-9\]/
  PASS  no match: /plan-[a-z]*\*/
  PASS  no match: /allowlist/
  PASS  no match: /segment/
  PASS  no match: /delimiter/
  PASS  no match: /suffix/
  PASS  no match: /\[0-9\]/
  PASS  no match: /\d/
  PASS  no match: /regex/
  PASS  no match: /highest N/
  PASS  no match: /hyphen|dash-separated|underscore|separator|stem/
  (one /sprint-/ hit, adjudicated below)
```

**The single `sprint-` hit is not grammar** — it is the ADR-041 filename inside the two markdown link
URLs (`adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob.md`), on added
lines 11 and 34 of the diff. A citation target, not a pattern. **No grammar leaked by R1's or R2's
clause.**

Whole-file greps for `allowlist|segment|delimiter|suffix|Sprint [0-9]` also return **no match**
(exit 1). The broader sweeps (`prefix`, `plan-`, `glob`) hit only **pre-existing** lines outside the
three hunks — `:100`/`:240`/`:331`/`:344` (task-status marker prefix, folder-ID prefix), `:210`
(the `<path-to-the-sprint-plan-you-resolved-in-step-1>` placeholder), `:325` (`dashboard.sh`'s own
`drift unresolved-plan-sprint` record name) — none touched by this task.

### Check 4 — `select-active` behaves as the prose documents — PASS

```
$ bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
⟦fkit-dashboard v1⟧
⟦SELECT⟧
active file="sprint-5.md" identity="Sprint 5"
candidate file="backlog.md" identity="Backlog"
candidate file="sprint-5.md" identity="Sprint 5"
⟦FACTS⟧
⟦END⟧
exit=0
```

Matches the prose on every point it asserts: version marker present; `active` names one file;
`backlog.md` is **listed as a candidate** with identity `Backlog` and is **not** selected; `done/`
and `reviews/` (both directories in `ai-agents/sprints/`) are not considered.

**Bonus — the plan's verification item 3 fixture**, rebuilt in the scratchpad (never in the repo) from
the reporter's seven §7 names:

```
$ bash claude/skills/fkit-status/dashboard.sh select-active <scratchpad fixture>
⟦fkit-dashboard v1⟧
⟦SELECT⟧
active file="plan-sprint-6.md" identity="Sprint 6"
candidate file="backlog.md" identity="Backlog"
candidate file="plan-index.md" identity="unresolved"
candidate file="plan-sprint-4.md" identity="Sprint 4"
candidate file="plan-sprint-4c.md" identity="Sprint 4c"
candidate file="plan-sprint-5.md" identity="Sprint 5"
candidate file="plan-sprint-6.md" identity="Sprint 6"
candidate file="sprint-backlog.md" identity="Backlog"
⟦FACTS⟧
⟦END⟧
exit=0
```

**Matches the plan's stated expectation exactly** — `plan-sprint-6.md` active, `sprint-backlog.md`
resolved to `Backlog` (so never eligible), `plan-index.md` `unresolved`. The compounded downstream
defect ADR-041 §6 describes does not reproduce.

### Check 5 — the two fixes are correct as written — PASS (both)

**R1 — is `file=` really a basename, and does the new prose say the right thing?**

Source: `dashboard.sh:243` builds each record with `basename "$_f"`. Measured both readings:

```
# OLD prose, followed literally (pass file= verbatim to step 4)
$ bash claude/skills/fkit-status/dashboard.sh sprint-5.md
dashboard.sh: no such sprint plan: sprint-5.md
exit=1

# NEW prose, followed literally (join file= to the ai-agents/sprints you passed in)
$ bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-5.md
⟦fkit-dashboard v1⟧
⟦BOARD⟧
| Status | # | Task | Filename | Owner | Next step |
…
exit=0
```

**R1 verified CORRECT.** `file=` is a basename; the old wording failed; the new wording
(*"`file=` is a basename, not a path — join it to the `ai-agents/sprints` you passed in, and pass
*that* to step 4"*) is the instruction that actually works, and renders the board.

**R2 — does `active none` really exit 3, and a real failure exit 1?**

```
# active none — dir holding only a Backlog-identity board
⟦fkit-dashboard v1⟧ / ⟦SELECT⟧ / active none / candidate file="backlog.md" identity="Backlog" / ⟦FACTS⟧ / ⟦END⟧
exit=3

# active none — empty dir
⟦fkit-dashboard v1⟧ / ⟦SELECT⟧ / active none / ⟦FACTS⟧ / ⟦END⟧
exit=3

# real failure — nonexistent dir
stdout: (empty; `grep -c SELECT` = 0)
stderr: dashboard.sh: no such sprints directory: …
exit=1
```

Source agrees: `dashboard.sh:296-297` (exit 0 with a pick, **exit 3** otherwise), `die()` at `:55`
(**exit 1**, stderr, before any block).

**R2 verified CORRECT.** Every clause of the new sentence holds: `active none` exits 3; it is a
well-formed answer carrying the version marker and the candidate list; a real failure exits 1 and
**prints no `⟦SELECT⟧` block at all** (measured: zero `SELECT` occurrences on stdout).

### Check 6 — owner ruling 1 held (`#### If the script fails` byte-identical) — PASS, by diff

Block boundaries located by heading in both versions: worktree `358`–`378` (heading `#### If the
script fails` at `:358`, next heading `### 5. Report — and stop there` at `:379`); `HEAD`
`330`–`350`. The 28-line offset is exactly the three hunks' net insertion (+26, +2, +0).

```
$ wc -c block-head.txt block-worktree.txt
    1127 block-head.txt
    1127 block-worktree.txt

$ shasum -a 256 block-head.txt block-worktree.txt
5f6043bd2a886165088b6ab96a83b0555a3b7236da306a2a78ca77d171311238  block-head.txt
5f6043bd2a886165088b6ab96a83b0555a3b7236da306a2a78ca77d171311238  block-worktree.txt

$ diff block-head.txt block-worktree.txt
(no output)
diff exit=0
```

**Identical byte count and identical sha256.** Owner ruling 1 held — the fourth edit site was not
touched.

Corroborating: `git diff -U0` hunk headers are exactly **three** —
`@@ -26,3 +26,29 @@`, `@@ -47,4 +73,6 @@`, `@@ -189,2 +217,2 @@`. No fourth edit site exists.

### Check 7 — working-tree scope — PASS, exactly the sanctioned set

```
$ git status --porcelain
 M ai-agents/sprints/sprint-5.md
 M ai-agents/tasks/backlog/0266-…/brief.md
 M claude/skills/fkit-status/SKILL.md
?? ai-agents/tasks/backlog/0266-…/plan.md
?? ai-agents/tasks/backlog/0266-…/review.md
?? ai-agents/tasks/backlog/0266-…/worklog.md
```

**Six paths, exactly the sanctioned set. No extra path.** The two non-`SKILL.md` modifications are
status tracking only, inspected and confirmed in scope: `brief.md` is a one-line `## Status`
`🔲 Backlog` → `🔄 In progress`; `sprint-5.md` is the matching one-row marker change on the `P6` row,
cell text otherwise byte-identical.

**`.claude/` does NOT appear** — `git status --porcelain | grep -c '.claude/'` → **0**, and
`git diff --name-only | grep -c '.claude/'` → **0**. Confirmed gitignored at source:
`git check-ignore -v` → `.gitignore:17:.claude/skills/fkit-*/`. The refreshed install copy is
identical to source (`diff` → no output) and carries no glob (`grep -n 'sprint-\*'` → exit 1), so
owner ruling 2's refresh landed without entering the diff.

### Standing caveat, restated rather than dropped

**`npm test` is a regression guard here, not evidence these two clauses are right.**
`test/dashboard-contract.test.js:2484` records `SKILL.md` prose as LLM-executed and untestable, and
the grep-guard test was owner-ruled out at the plan gate. The evidence that R1 and R2 are correct is
the **measured `dashboard.sh` output in check 5**, reproduced independently this session — not the
green suite, and not the claims recorded earlier in this worklog.
