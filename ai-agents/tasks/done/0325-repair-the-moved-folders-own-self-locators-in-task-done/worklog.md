# Worklog — 0325 repair the moved folder's own self-locators in `/fkit-task-done`

Built by a spawned `fkit-coder` **Build worker** under `/fkit-sprint-ship-loop` (ADR-032 Decision 3),
on the driver's declared-approval marker. `plan.md` (blob `441b71bf82aa067839e57d0d60060a08b7b8f58d`,
11054 bytes, verified with `git hash-object` before the first edit) **is the autonomy boundary**.
Implemented 2026-08-26. `HEAD` was `c45ec3d` ("Ship push") at spawn; the driver committed `493cecd`
("Sprint push") mid-build, so the diff figures below were re-measured against `493cecd`.

## Owner-decision log

- **Plan gate (2026-08-26, `AskUserQuestion` in the driver session):** approved — verbatim label
  **"Approve"**.
  - **Q1 — test:** verbatim label **"No test (Recommended)"**. See *No new test — the decision* below.
  - **Q2 — reach:** verbatim label **"Header block only (Recommended)"**. A self-locator is a named
    field above the first `## ` heading; body-prose forwarding pointers and `File(s) under review:`
    self-entries are frozen and listed in the step 7 report.
  - **Q3 — `fkit-task-cancelled` mirror:** verbatim label **"Follow-up brief (Recommended)"**. This
    task edits `fkit-task-done` only.
- **Fixes applied unattended, without asking (ADR-019 audit obligation):** `none`. No review round
  ran in this spawn; every edit came from the approved plan's steps 2–5.
- **Obvious-winner calls made unattended:** **one**, recorded here.
  - **Naming the two Q2 freeze cases in the ⛔ paragraph.** The approved bullet (plan step 3)
    defines the header-block test and says a locator "asserts nothing", which *implies* that a
    `File(s) under review:` line and a below-heading forwarding pointer are frozen — but it never
    names either, and the spawn prompt asked me to "make sure the rule text says so". **What I did:**
    appended one sentence to the first ⛔ paragraph of the new bullet (`SKILL.md:213–216`): *"Not in a
    ledger's `File(s) under review:` line — it records what was reviewed, not where the brief is — and
    not in a forwarding pointer that sits below the first `## ` heading: both fail the header-block
    test above, so they stay frozen and go in the step 7 freeze list."* **Why it qualified:** it
    restates the owner's Q2 ruling verbatim in intent, adds no new rule, changes no existing sentence,
    and one option (name the ruled cases) clearly dominates the other (leave them implied). Localized
    to three lines inside the new bullet. The driver should re-verify it against Q2.

## What changed — one file

`claude/skills/fkit-task-done/SKILL.md` only. `git diff --numstat` = `58 2`; `git diff -U0` shows
exactly four hunks, all in steps 4, 5 and 7; nothing in step 1 (`0229`/`0135`/`0134`'s region).

| Hunk | Where (post-edit lines) | What |
|---|---|---|
| `@@ -118 +118,2` | step 4, the `ai-agents/tasks/` bullet | appended the clause *"— including the moved folder's own record files, which point at themselves; step 5 rules that self case"* |
| `@@ -188,0 +190,47` | step 5, directly after the sibling-outbound bullet | the new **"The moved folder's OWN self-locators"** bullet: the repair rule, the role-not-string definition (header block above the first `## `), two ⛔ paragraphs, the `0250` six-row worked example (2 repair / 4 freeze) |
| `@@ -229 +277,3` | step 5 "Then prove it." | appended *"Every self-locator you re-pointed must name a file that now exists — most are code spans, not markdown links, so the link check above does not reach them; test the path."* |
| `@@ -254,0 +305,6` | step 7, directly after "Re-pointed links" | new bullet **"Self-locators repaired, and self-hits left frozen"** — brief item 6 decided **yes, report them**: the freeze calls are judgments and the report is the only place they can be checked |

Pure insertion: no existing step-5 bullet's text changed (the `-` lines in the diff are the two
lines that gained an appended clause/sentence, re-emitted with their suffix).

## No new test — the decision, stated so it does not pass unremarked

**Owner ruling Q1: no test.** Reasoning recorded: `SKILL.md` is a procedure document — prose an
agent reads. `test/skill-frontmatter.test.js`'s own header scopes the repo's content tests to
invariants over shipped content (frontmatter parse), not to whether an agent follows a procedure.
The property that matters here — 2 repaired / 4 frozen on a real close — is not mechanically
checkable by `node --test`. A presence guard (two anchor phrases + a `prove-red.sh` mutation) would
guard only against silent deletion; declined by the owner.

**Named follow-up, gated on `0168`:** a corpus test asserting no `done/*/` record file carries a stale
self-locator. It would be **red on day one** (46 measured instances: 44 `review.md`, `0248`
`plan.md`, `0218` `worklog.md`) and stays red until `0168` lands, so it is `0168`'s deliverable or a
follow-up after it — not shippable green here.

## Measurements made this build (2026-08-26)

- **The two unowned stale self-locators, re-confirmed on disk, NOT fixed (out of scope):**
  - `ai-agents/tasks/done/0248-update-the-docs-for-the-structure-check-capability/plan.md:12` —
    `**Task:** \`ai-agents/tasks/backlog/0248-…/brief.md\``
  - `ai-agents/tasks/done/0218-repair-0177s-stale-cap-and-byte-figures/worklog.md:8` —
    `**Plan:** \`ai-agents/tasks/backlog/0218-…/plan.md\`, approved by`
  Both sit outside `0168`'s `review.md`-only scope. **Still unowned.**
- **`cancelled/` measured for the same defect:** 11 task folders; **every one holds `brief.md` only**
  — zero `plan.md` / `review.md` / `worklog.md`, so **0 stale self-locators, and 0 files that could
  carry one.** The defect cannot exist there *today*; it will the first time a task with records is
  cancelled.
- **`claude/skills/fkit-task-cancelled/SKILL.md` checked (Q3):** it carries the same sibling-outbound
  bullet (*"The moved folder's OWN outbound links"*, `:186`) and **no self-locator rule** — the same
  gap, by inspection. **Not edited** (Q3). **Follow-up brief for the producer to file:** mirror this
  rule into `fkit-task-cancelled` step 5/7.
- **Manifest:** `claude/structure-manifest.tsv` has **0** rows matching `skills/` — `SKILL.md` is not
  manifest-tracked; **no regen** (`0188` untouched).

## Verification — the plan's six, with evidence

1. **Amended step 5 read end to end** (`sed -n '146,278p'` on the edited file): one procedure; the
   new bullet opens by naming the sibling bullet as the case it extends ("the case the bullet above
   does not reach"), contradicts nothing, and the Q2 header-block test is stated in the bullet body
   and in the ⛔ paragraph. ✅
2. **Rule walked against `0250` as it stood at close** (six occurrences re-measured this build):
   - selects `plan.md:5` (`Brief:` header field, own brief) and `review.md:3` (`Task:` schema line,
     own brief) — **both already read `done/`** (repaired 2026-08-23), so the rule's idempotency
     clause makes them **no-ops**, as the plan's edge case 9 requires;
   - rejects `plan.md:117` (fenced `git status --porcelain` capture, elided `0250-...`),
     `plan.md:188` (plan step 7 text, elided), `review.md:86` and `:98` (dated measurements about
     `0324`, naming `backlog/` correctly) — all four fail the header-block test and each matches a
     named ⛔ case. **Exactly 2 / 4.** ✅
   - **Walked against `0327`:** header block of `plan.md` (`:5` `Brief:`) and `review.md` (`:3`
     `Task:`) — both already `done/` → no-op; `review.md:4–5` `File(s) under review:` names `claude/`
     files, not a task path → nothing to do; `worklog.md` header carries no path locator;
     `review.md:401–402` (change-surface table, elided `0327-…`) → **freeze**; `review.md:122` and
     `:464` (paths of `0334`/`0335`/`0336`, correctly under `backlog/`) → **freeze**, another task's
     path. ✅
3. **Freeze cases are ⛔ paragraphs in the rule body** (`SKILL.md:209–221`), between the definition and
   the worked example — not a footnote. ✅
4. **Manifest:** not tracked (0 `skills/` rows) — no regen. ✅
5. **`node --test test/*.test.js`:** **774 tests / 24 suites / 774 pass / 0 fail** (run twice: after
   the four plan edits and again after the obvious-winner sentence; identical counts).
   **`bash test/prove-red.sh`** (the working-tree version, which is itself modified by the driver's
   parallel work): **hard gate PASSED** — real launcher green, unmutated copy green, all **24**
   mutations red on their named assertion; exit 0. Run once, after all edits; it took longer than a
   5-minute foreground cap, so it ran in the background and its log was read on completion.
6. **`git diff --numstat`** on my change = `58 2 claude/skills/fkit-task-done/SKILL.md`; **`git diff
   -U0`** = four hunks at `-118`, `-188`, `-229`, `-254`, i.e. steps 4, 5, 5-prove, 7; the nearest
   hunk to step 1 starts at line 118. ⚠️ The working tree also carries *other* modified files that are
   **not mine** (the driver's parallel work — `claude/fkit-claude.sh`, `test/prove-red.sh`,
   `fkit-sprint-ship-loop/SKILL.md`, boards, `0204`'s move, etc.); the "one file" claim is about this
   task's change, checked per path, not about a clean tree. ✅

## Dogfood copy — NOT refreshed here

`.claude/skills/fkit-task-done/SKILL.md` (gitignored) now differs from the source. I did **not** run
`claude/fkit-claude-init.sh .`: on an already-set-up project it is not confined to `.claude/` — it
unconditionally rewrites `.fkit/interview` (`cat >`), runs `merge_rules` on `CLAUDE.md`/`AGENTS.md`,
and has an `ai-agents/` convergence branch — and the script itself carries `0327`'s uncommitted
working-tree edits. The plan's stated alternative applies: **the copy refreshes on the next `fkit`
launch.**

## Follow-ups and residuals (flagged, not actioned)

1. **Producer to file:** mirror the self-locator rule into `claude/skills/fkit-task-cancelled/SKILL.md`
   (Q3). Same gap confirmed by inspection at `:186`.
2. **Corpus test** (no stale self-locator in `done/*/`) — gated on `0168`.
3. **`0248` `plan.md:12` and `0218` `worklog.md:8`** — stale, unowned, untouched.
4. **`0168`'s board dependency `depends="0160 — hard."` is stale** (`0160` is done) — not this
   task's row.
5. **The 44 / 1 / 1 figures are floors** (12-line presence check), per the brief.

## Deliberately not done

- No commit, no push, no task file moved, no `plan.md` edit, no `ai-agents/wiki-vault/` write.
- No edit to any `done/` or `backlog/` task record (the 46 stale locators are `0168`'s).
- No `fkit-task-cancelled` edit (Q3), no test file (Q1), no manifest regen, no step 1 edit.
- No `fkit-claude-init.sh .` run (see above).

## Process-review — Round 1 (2026-08-26)

Run by a spawned `fkit-coder` **Process-review worker** under `/fkit-sprint-ship-loop` (ADR-032
Decision 3), on the driver's declared-approval marker; `plan.md` re-hashed at spawn =
`441b71bf82aa067839e57d0d60060a08b7b8f58d`. Method: `fkit-process-stateful-review` steps 0–7; the
per-round owner gate replaced by the standing approval (ADR-019 discipline). **Never edited
*Reviewer findings*.**

- **Dispositioned:** R1–R7, all `✅ done`. Six `CORRECT`, one `PARTIALLY CORRECT` (R5 — not a strict
  contradiction; the cold-reader ambiguity is real). Zero closeout, zero disproven, zero frontier.
  Loop check: no accepted residual or ADR "re-raise only if" matched any of the seven.
- **Owner ruling folded in:** R4 → **"Extend the definition (Recommended)"** (`AskUserQuestion`, driver
  session, 2026-08-26). Recorded as a shared residual in `review.md`; the Q2 line was not rewritten.
- **Change surface:** `claude/skills/fkit-task-done/SKILL.md` only (`git diff --numstat` for this task =
  `75 4`, five hunks: `-117,2`, `-127`, `-188,0`, `-229`, `-254,0`); this folder's `review.md` (Coder
  response rows + one residual) and `worklog.md` (this section). `plan.md` untouched.
- **Tests:** `node --test test/*.test.js` → **774 tests / 24 suites / 774 pass / 0 fail**;
  `node --test test/skill-frontmatter.test.js` → **28 pass / 0 fail**. `prove-red.sh` **not run** — no
  test file changed.
- **Ledger `Status`:** left **`in-review`**. Every row is `✅ done` (a fix), not closeout / disproven /
  accepted; the reviewer has not re-verified the seven fixes. Closing out is one reviewer round away.

### Decision log — fixes applied without asking (ADR-019 audit obligation)

Each below was verified `CORRECT` (or the correct part of `PARTIALLY CORRECT`) first-hand, is a
wording change in the one approved file, and sits inside the approved plan's intent (the new prose
plus the step 4 region the plan already touched). None changes a ruled outcome: Q1/Q2/Q3 stand, and
no `0250` row's repair/freeze verdict moved.

| Finding | What changed (`SKILL.md`, post-edit lines) | Why it qualified |
|---|---|---|
| R1 | `:219–223` — `File(s) under review:` freeze reasoned by the *role* prong; below-heading pointer by the *position* prong | verified (`0250` `review.md:4` is above `:22`); one sentence; outcome unchanged (Q2) |
| R2a | `:231–232`, `:242`, `:244–247` — "seven occurrences, 2 repair / 5 freeze"; row 7 (`review.md:26`, freeze); trailer "rows 5–7", "all seven" | counted at `c45ec3d` myself: 5 surviving + 2 repaired = 7; adds a freeze row, changes no existing verdict; the driver named this count check |
| R2b | `:225–229`, `:247–249` — grep returns full-folder-name hits only; the two step 7 lists are its own returns; bare `tasks/backlog/` named as not-returned; rows 3–7 are illustration, not a list to compile | restates the plan's "no sweep" rule; removes the hunt ambiguity without adding a search |
| R2c | `:322–324` — step 7 reason phrases add findings row / `File(s) under review:` line / pointer below the header block | the two Q2 cases the ⛔ paragraph already sends to that list; mechanical |
| R3 | `:204–213` — "value *names* a path"; composite forms `Task: 0160 — …` and `**Plan:** …, approved by …` named as locators (re-point path, keep ID/clause) | verified both on disk; the plan's §2 cases 4 and 6 promised exactly this |
| R4 | `:204–207`, `:222` — header block = first heading of level 2 or lower, else the leading field block; "below the header block" | **owner-ruled** ("Extend the definition"); applied as ruled |
| R5 | `:128–129` — parenthetical: a reported frozen self-hit is handled, not "nothing" | pre-existing step 4 line, same file; the driver named it in scope; no meaning change; cheapest-to-reverse |
| R6 | `:116–119` — clause re-parented under "live inside the task folders" | same words, reordered; +1 line |
| R7 | `:231`, `:244–246` — `NNNN` (`slug`) on first mention for `0250`, and for the `0324`/`0188` prose mentions I author | convention binds any file; sibling skill already uses the form |

- **Obvious-winner calls made unattended:** `none` beyond the table — every change answers a finding.
- **Things I did NOT change, on purpose:** the six original table rows' verdicts; the quoted fragments
  in table cells (`0324` bare inside quotes — they are quotations); step 1; `fkit-task-cancelled`;
  any `done/` record (`0248` `plan.md:12`, `0218` `worklog.md:8` still stale, still `0168`-adjacent
  and unowned); the Q2 residual line in `review.md`.

### Deliberately not done (this round)
- No commit, no push, no task move, no `plan.md` edit, no wiki write, no test file, no manifest regen.
- No `fkit-claude-init.sh .` run (same reason as the build entry above) — the dogfood copy refreshes
  on the next `fkit` launch.
- `Status: closed-out` not set — see above.

## Process-review — Round 2 (2026-08-26)

Run by a spawned `fkit-coder` **Process-review worker** under `/fkit-sprint-ship-loop` (ADR-032
Decision 3), on the driver's declared-approval marker; `plan.md` re-hashed at spawn =
`441b71bf82aa067839e57d0d60060a08b7b8f58d` (11054 bytes). Method: `fkit-process-stateful-review`
steps 0–7; the per-round owner gate replaced by the standing approval (ADR-019 discipline). **Never
edited *Reviewer findings*.** R1–R7 were closed by the reviewer's Round 2 and were not reopened.

- **Dispositioned:** R8 only — `CORRECT`, defect (wording), `✅ done`. Zero closeout, zero disproven,
  zero frontier. Loop check: the Q2 residual ("frozen **and listed** in the report") is the ruling the
  fix lands inside, not a re-raise; the R4 residual untouched; no ADR "re-raise only if" matched.
- **Verified first-hand:** the three-way disagreement at `SKILL.md:222–223` / `:227` / `:321–322`
  (pre-fix lines), and all six cited elided `File(s) under review:` self-entries on disk. A count of
  header-block lines naming `tasks/backlog/<own-id>-…/` across `done/*/{review,plan,worklog}.md`
  found 7 (the `…` form only; the `...` form at `0162`, `0132`, `0174` is on continuation lines and
  was confirmed by reading, not counted).
- **Change surface:** `claude/skills/fkit-task-done/SKILL.md` only (`git diff --numstat` for this task =
  `80 4`, still five hunks: `-117,2`, `-127`, `-188,0`, `-229`, `-254,0`; nothing in step 1); this
  folder's `review.md` (R8 row + header `Status`) and `worklog.md` (this section). `plan.md` untouched.
- **Tests:** `node --test test/*.test.js` → **774 tests / 24 suites / 774 pass / 0 fail**;
  `node --test test/skill-frontmatter.test.js` → **28 pass / 0 fail**. `prove-red.sh` **not run** — no
  test file changed.
- **Ledger `Status`:** set to **`closed-out`** — every row R1–R8 is `✅ done`, nothing pending, blocked
  or open. The reviewer's Round 3 re-verifies the R8 fix; if it disagrees it reopens.

### Decision log — fixes applied without asking (ADR-019 audit obligation)

| Finding | What changed (`SKILL.md`, post-edit lines) | Why it qualified |
|---|---|---|
| R8 | `:222–224` — "each one you *meet* — as a step 4 grep return, or while reading the header block for locators — goes in the step 7 freeze list"; `:228–231` — the two step 7 lists are the grep's returns "plus any `File(s) under review:` self-entry the header block showed you … nothing hunted for beyond the grep and the header block"; `:325–326` — step 7 asks for self-hits that are "a step 4 return, or one met in the header block" | verified `CORRECT` on disk (six sites); three-sentence wording change in the one approved file; sits inside Q2's ruling ("frozen and listed") and adds no search — the header block is already read to find locators; the driver named this exact reconciliation shape; regression-checked against R2(b) (no-hunt boundary kept, now explicit) |

- **Obvious-winner calls made unattended:** `none`.
- **Things I did NOT change, on purpose:** the "elided self-path … is not a locator" sentence
  (`:231–233`, Codex's unrecorded note — reviewer judged it follows from the role prong); every
  `0250` table row; step 1; `fkit-task-cancelled`; any `done/` record; the Q2 / R4 residual lines;
  the reviewer's header line (`File(s) under review:` with its Round 2 line ranges — those ranges
  are now off by up to +4 lines below `:222`; reviewer-owned, left as written).

### Deliberately not done (this round)
- No commit, no push, no task move, no `plan.md` edit, no wiki write, no test file, no manifest regen.
- No `fkit-claude-init.sh .` run (same reason as the build entry) — the dogfood copy refreshes on the
  next `fkit` launch.
