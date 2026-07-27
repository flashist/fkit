# Worklog — task 0103: the task-folder-name scheme change (Option C)

## Phase 1 — 2026-07-26/27, `fkit-coder` spawned as the Build worker of `/fkit-sprint-ship-loop`

**Autonomy basis.** Ran under the declared-approval marker (ADR-032 Decision 3 + its 2026-07-22
autonomy amendment): the driver named itself, carried a concrete approved plan, and stated the owner
approved that plan via a live `AskUserQuestion` relay. The approved plan was both the standing
approval and the scope boundary. **This record is written because ADR-032 A2's audit obligation is
right, not because a check forced it — the driver-side implementation of that obligation is task
0147 and does not exist yet.** No owner channel was available to this spawn (ADR-021).

**Nothing was committed or pushed.** Everything is left in the working tree.

---

### What was executed autonomously, in order

**Step 0 — baseline.** Ran `dashboard.sh` against `sprint-2.md`, `backlog.md`, `done/sprint-1.md`;
captured stdout and the per-file drift **kinds+counts** to `/tmp/0103/before-*.kinds`. Kinds and
counts (not ids) are the comparison target, because every id changes by design.

> ⚠️ **Deviation from the plan's §0 grounding, recorded rather than smoothed over.** The plan
> recorded `sprints/done/sprint-1.md` at **9** drift facts. The live measurement is **7**
> (2 `disagreement` + 5 `nonconformance`). The plan's §12 expectation of "9 vs 9" is therefore
> wrong as written; the check performed was the *intent* of it — before-vs-after kinds+counts on the
> real number. It came out 7 vs 7, unchanged. I did not investigate why the plan's figure differs.

> ⚠️ **The tree was NOT clean at start.** `git status` already carried modifications (including
> `ai-agents/sprints/sprint-2.md`, several `wiki-vault/` files, and a staged `0119-…` folder rename).
> Baseline `git status` was captured so my own change surface could be isolated by diff. It was:
> exactly `claude/skills/fkit-status/dashboard.sh` and `test/dashboard-contract.test.js`, nothing else.

**Step 1 — `dashboard.sh` identity inversion (plan §4, 1a–1e).**
- Added `folder_id_prefix()` after `task_id()`, numeric-only, with the rationale for the guard and an
  explicit note that it is deliberately **not** the same parse as the `id-mismatch` check's
  `${folder%%-*}`, so a later reader does not unify them.
- Deleted the early `tid=$(task_id "$pr")`. Verified by grep that `tid` has no reader between the old
  assignment site and the first `add_fact` — all readers are at line 639+, the assignment at 580-585.
- Replaced the FACTS-id comment block and fallback with the inverted ladder
  (folder ID prefix → priority → sanitised folder name → `?`).
- Left the `id-mismatch` block byte-identical (1d). `?` sentinel and `set -f` retained.
- `bash -n` clean.

Verified the helper by direct execution: `0102-decide-x`→`0102`, `0001-my task`→`0001`,
`0002-re[a]d`→`0002`; and correctly **rejected** (empty) `extract-scaffold`, `backlog`, `0042 alpha`,
`""` — including the space case E1 exists for.

**Effect on the live tree:** `derive 104` → `derive 0103`; backlog's `derive 0013-add-worked-example-…`
→ `derive 0013`. All 19 distinct sprint-2 FACTS ids are exactly 4 digits and **every one resolves to a
real task folder** on disk (checked with `find`, after a first attempt using zsh brace-glob produced
false "MISS" lines — that was my shell aborting the expansion, not a real miss; re-run correctly).
Drift kinds+counts unchanged on all three files.

**Step 3 — the FACTS-id test literals (plan §5).** ~44 sites. Method was failure-driven and per-site,
never a blind batch sed, because the fixture assigns ids by **insertion order of the `briefs` object**,
not by the priority the row writes. Sites were padded in line-scoped passes and the suite re-run
between passes. Three mappings were **not** `1 → 0001`:
- the `folderTree` sites (`:1822/:1840/:1867`) → **`0042`** (explicit folder `0042-alpha`);
- the trap-B site's priority `7` → `0001`;
- **the missing-brief site → `0099`**, which my generic pad initially got wrong. Caught by a red bar,
  read, and corrected: the href is `../tasks/backlog/0099-gone/brief.md`, and `tid` is derived
  **syntactically from the href with no filesystem requirement** — exactly the plan's §4 1e
  consequence. A comment now records why it is `0099` and not the priority.

Added the **two-legged red-proof**: leg 1 holds the priority and moves the folder (id must move);
leg 2 holds the folder and moves the priority (id must not move). To support leg 2 I added a
`priority` parameter (default `'1'`) to the existing `folderTree` helper rather than creating a second
builder, per the plan — every existing caller is unchanged.

Added a second new test covering the `P<n>` rank token end-to-end: it parses cleanly, does **not**
become the id, and the board renders the cell verbatim `P` and all.

**The three sites §8 does not name, all three handled:**
- `:1634` — re-pointed `\d{4}-zeta` → `\d{4}`, renamed to task 0103. Kept the
  `doesNotMatch(rollup, /drift on tasks \?/)` assertion; the `?`-is-the-failure-mode point is unchanged.
- `:1691` — `\d{4}-a` → `\d{4}`. The distinguishing `doesNotMatch(out, /high-value/)` assertion left
  exactly as-is.
- `:1735` — **the silent-coverage-loss one.** Its two fixtures now key on safe numeric prefixes
  (`0001`, `0002`) and no longer reach the sanitiser the test exists to guard, so it would have stayed
  GREEN while proving nothing. Added a third row whose folder (`raw name`) carries no numeric prefix,
  so the ladder falls through to arm 3 and the sanitiser is genuinely exercised; asserted the id comes
  back as the sanitised `raw-name`. The id collection was widened across drift kinds (the unprefixed
  row reports `missing-brief`, not `nonconformance`) because the hazard is the positional id itself,
  not the kind. Counts updated 2 → 3.

**Step 5 — trap B (plan §6).** Replaced the two ⚠️ header comment lines, the test name and the
assertions in one edit, carrying an explicit *do not restore the old assertion or revert step 1*
warning naming task 0103 and the decision report.

**Step 6 — the §7 scratch tree.** Written at `/tmp/0103-movers/` exactly as specified (the
`0999-scratch-mover-probe` folder, its brief, and `sprint-9.md` with the `P42` cell), **left in the
`P42` state for the producer**. The bare-`42` control was made as a separate copy at
`/tmp/0103-movers-control/` so the P42 tree the producer needs was not disturbed.

**Per owner ruling D2 I did NOT run the movers** — they are producer-only (ADR-033 §1) and the
ADR-018 hook denies the coder at any spawn depth. I ran only the plan's check 3, which is mine.

---

### Verification actually performed

| Check | Result |
|---|---|
| `node --test test/dashboard-contract.test.js` | **109/109 pass, 0 fail** |
| `npm test` (`node --test test/*.test.js && bash test/prove-red.sh`) | **523/523 pass, 0 fail**; `prove-red.sh` hard gate **PASSED** — real + unmutated copy green, and each of the 7 mutations reds its named assertion |
| Drift kinds+counts, before vs after, all three plans | **UNCHANGED** — sprint-2 0→0, backlog 0→0, sprint-1 7→7 |
| Every sprint-2 FACTS id is 4-digit and resolves to a real task folder | 19/19, zero misses |
| Change surface, by `git status` diff against the captured baseline | exactly 2 files added to the status; **no task folder touched, no renames introduced** |
| Scratch tree check 1 (movers' step-4 folder-name grep) | returns the sprint-9 row, `P42` and bare-`42` byte-identical apart from the cell |
| Scratch tree check 2 (movers' step-5 row shape) | matches on both trees, identically |
| Scratch tree check 3 (`dashboard.sh` on the scratch plan) | exit 0, `⟦fkit-dashboard v1⟧`, `#` cell renders `P42`, FACTS id `0999` (**the folder, not the priority 42**), zero drift; control identical in FACTS |

**Red-proof of the guard itself.** Temporarily reverted the ladder in `dashboard.sh` and re-ran only
the task-0103 tests: **4 of the 5 went red**, then the script was restored and verified
byte-identical against a saved copy. The fifth — the glob/metacharacter test — stays green on a
revert **by design**: its rows carry a `—` priority, so they reach arm 3 under either ladder. It
guards the *sanitiser*, not the ladder order. Recording that rather than claiming a clean 5/5.

---

### Evidence gathered for the owner / phase 2

- **D3 confirmed by measurement.** `claude/agents/fkit-producer.md` carries **no** Priority-cell or
  board-row template — only a role blurb and a generic brief-shape list. There is no site to edit;
  the actual writer of board rows is `fkit-task-brief`. Reported as evidence, not invented.
- **Neither mover reads the Priority cell.** The only `priority` occurrences in either mover's
  `SKILL.md` are in the `➡️ Moved to Sprint 2 — priority 7` **prose inside the Status cell**, which
  both files explicitly require to stay *byte-identical*. Strong evidence `P<n>` is inert to them —
  but per D2 this is **not** a substitute for the producer's literal run.
- **A small inaccuracy in the plan's §7 pass criterion.** It expected the step-4 grep to return "both
  the brief path and the sprint-9 row". It returns **only the sprint-9 row**: the grep is
  content-based, and a brief's own text does not contain its folder name. The mover's literal command
  was run and behaved correctly; the plan's stated expectation was simply wrong.

---

### Explicitly NOT done in phase 1 (deferred to phase 2 by the driver's bounded scope)

- Step 2b — `P<n>` rendering in `ai-agents/sprints/sprint-2.md`, and `backlog.md`.
- Step 6 — board link-label normalisation.
- Step 4 — the `claude/skills/fkit-status/SKILL.md:299-304` narration rewrite. **Nothing goes red if
  this is missed** (it is prose), which is exactly why it is tracked as its own step.
- The `claude/skills/fkit-task-brief/SKILL.md` writer updates.
- Step 8's `bash claude/fkit-claude-init.sh .` mirror refresh — so the gitignored `.claude/` copy of
  `dashboard.sh` is currently **STALE**. Any verification run through `.claude/skills/…` right now
  would test the OLD script and report a false green. Phase 2 must refresh it first (plan E14).
- Step 7 — the convention page. Gated on owner sign-off (D5), which has not been given.

---

## Phase 2 — 2026-07-27, same `fkit-coder` spawn, same declared-approval marker

Driver confirmed the marker still stands (caller `fkit-sprint-ship-loop`, owner-approved plan,
rulings D1/D3/D4 unchanged). **No commits, no pushes. No `wiki-vault/` write.**

### Ruling D2 discharged — the producer's literal mover run

**Verdict: NO — `P<n>` breaks neither mover.** Both `/fkit-task-done` and `/fkit-task-cancelled` ran
end-to-end against the `P42` board: row located, status cell rewritten to a well-formed 4-cell row,
folder `git mv`'d (exit 0, staged `R`), href re-pointed, brief status set, links resolving. The
bare-`42` control leg differed in **exactly one pipe-delimited field** — the Priority cell's own text —
and the two moved briefs were **byte-identical**.

> **⚠️ THE QUALIFIER IS THE ACTUAL FINDING, recorded verbatim as the driver required.** It works
> because **neither mover reads the Priority column at all**. The sweeps key on the folder name
> (column 4); step 5 writes column 1 and the column-4 href. There is no parse of column 2 to break —
> so the movers are **indifferent** to the cell's content, not **compatible** with the new token.
> **They would step over `P42`, `42`, `banana`, or an empty cell alike.**

**Unreached edges the producer named, recorded so nobody reads this as broader coverage than it is:**
- the sandbox needed `git init` for `git mv` — the movers **hard-assume a git working tree**;
- **no mover refused a `/tmp` path** — no repo-root guard fired;
- the **ADR-018 deny path was not tested** (it ran as the producer, which is allowed).

The producer also confirmed my phase-1 correction: the step-4 sweep returns **only** the sprint row,
not the brief path. The plan's §7 pass criterion was wrong; my correction stands.

### A producer observation, considered and ruled — NOT acted on

The producer asked whether the scheme should also cover a **brief's own `## Priority` field**, which
stays bare `42` while the board reads `P42`. **The approved plan already rules NO** (§8 "Explicitly NOT
touched"): the brief field stays a plain number, and `fkit-sprint-ship-loop/SKILL.md:81` **orders by
that field**. Recorded here so a later reader sees this was considered and decided, not missed.

### Step 2b — `P<n>` rendering

Applied the awk admission-window state machine (mirroring `extract_rows`' grammar), **not** a
whole-file sed — `sprint-2.md`'s `## Status` section runs past the board and contains other pipe
tables whose second column holds `**0139**`, `*(new)*`, `---`.

Measured the window programmatically first: separator at line 32, **130 rows, lines 33-162**, and all
130 Priority cells bare integers. After: **130 P-cells, 0 bare integers, 130 additions == 130
deletions, line count unchanged (2044), and every changed line inside 33-162 (min=33 max=162
count=130)**.

`backlog.md` correctly **not** touched by this step — measured 16/16 cells already `—`.

The `➡️ Moved to [Sprint N](…) — priority M` prose markers in Status cells are **byte-identical**
(15 before, 15 after, diff empty), as §8 requires.

### Step 6 — Option D label normalisation

Applied inside the same admission windows (`sprint-2.md` 33-162, `backlog.md` 41-56), Brief cell only,
with the href reproduced as a **captured group** so it is never rebuilt from parts.

- **Proof A** — label == its own href's folder segment, 0 exceptions, both files. Passed (no output).
- **Proof B** — first run returned **131** for sprint-2, not the expected 130. **Investigated rather
  than waved through:** two rows carry a *second* label in the **Task-description** cell, and line
  122's is a report named `2026-07-23-eval-…`, whose `2026-` prefix my count regex matched. Not a
  Brief cell. Re-counted against the last cell only: **130 / 16 exactly.** The two Task-cell
  knowledge-base links are byte-identical before vs after.
- **Proof C** — the hard constraint. **Baseline is my own pre-edit copy, NOT `git show HEAD:`**, because
  the tree was already dirty when I started and HEAD cannot isolate my change. sprint-2: **HREFS
  UNCHANGED (133 targets)**; backlog: **HREFS UNCHANGED (16 targets)**. Widened to *every* link target
  in each file, not just `../tasks/`: unchanged in both.
- **Proof D** — all **144** distinct task hrefs still resolve on disk; no BROKEN output.
- **Idempotence** — re-running the normaliser produced a byte-identical file.

My isolated change: sprint-2 **130 lines, all in 33-162**; backlog **6 lines, in 41-46** (matching the
plan's measured 6 legacy labels).

### Step 4 — trap A, the `fkit-status/SKILL.md` narration

Rewrote the `<task>` block (found at **299-304**, the plan's line numbers were accurate). End state
verified: `grep -n 'Priority number' claude/skills/fkit-status/SKILL.md` returns **nothing**, and
`filename stem` returns nothing.

> **⚠️ A CONFLICT INSIDE THE APPROVED PLAN, resolved and disclosed rather than silently picked.**
> Plan §10's prescribed replacement text (transcribed into `plan.md`'s back-filled "Step 4" section
> on 2026-07-27, review finding R2) contains the phrase *"was the Priority number"* — which is
> exactly the string E11's verification grep requires to return **nothing**. The two parts of the
> approved plan cannot both hold as written. I changed those three words to *"was the board's rank
> number"*: identical meaning, and both the prescribed text's intent and the named end-state check now
> hold. This is a wording deviation from §10's literal text and is flagged as such.

**Confirmed, not assumed, per the driver's instruction:**
- `:169-171` (the `—` cells narration) — **still true.** It describes the **Backlog** board, whose
  cells I did not touch (16/16 still `—`).
- `:334` (the six board columns `Status · # · Task · Filename · Owner · Next step`) — **still true**,
  and matches the live dashboard output run this session.

### The `fkit-task-brief/SKILL.md` writer updates (§8 item 2, ruling D3)

- The pull-into-sprint step 1 (**actual line 287**, not the approved plan's stale `:294` — line numbers
  had shifted; both are recorded in `plan.md`'s back-filled "Step 2b" section)
  now writes the rank token `P<n>` instead of "a real priority number".
- The `**The Priority cell is `—`, always.**` rule for `backlog.md` is unchanged and correct; added the
  contrast clause naming `P<n>` for a sprint board, so the distinction is explicit at the point of writing.
- The fresh-project `backlog.md` template keeps `—` — **no change**, as planned. It is also the *only*
  board-row template in that file, so there is no sprint-row template there to convert.

**D3 re-confirmed by measurement:** `claude/agents/fkit-producer.md` carries **no** Priority-cell or
board-row template — only a role blurb (`:4`) and a generic brief-shape list (`:96`). No site was
invented.

### Step 8 — full verification

Ran `bash claude/fkit-claude-init.sh .` **first**, per my own phase-1 caveat that the `.claude/` mirror
was stale and would report a false green. All three touched files verified in sync afterwards.

| Check | Result |
|---|---|
| `bash .claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` (the brief's named command, via the mirror) | exit 0, `⟦fkit-dashboard v1⟧`, `#` column reads `P104`/`P108`/…, labels are folder IDs, FACTS `derive 0103 …`, **0 drift** |
| Drift kinds+counts vs the step-0 baseline | **UNCHANGED** — sprint-2 0→0, backlog 0→0, **sprint-1 7→7** |
| New id-mismatch / missing-brief / relocated / malformed-folder | **ZERO** — the only drift anywhere is sprint-1's pre-existing 2 disagreement + 5 nonconformance |
| `node --test test/dashboard-contract.test.js` | **109/109 pass, 0 fail** |
| `node --test test/launcher-contract.test.js` | **40/40 pass, 0 fail** |
| `npm test` | **523/523 pass, 0 fail**; `prove-red.sh` hard gate **PASSED** |
| No renames introduced, no task-folder content touched | confirmed (the staged `0119-…` rename is pre-existing, present in the step-0 baseline) |
| `wiki-vault/` | git status for it **identical to the baseline** — nothing written |

> ⚠️ **sprint-1's baseline is 7, not the plan's 9.** Used the measured number, as the driver directed.

### Step 7 — the convention page: FILED (D5 signed 2026-07-27)

**The arc, in order, because the outcome alone would not explain the page's shape:**

1. **Drafted, not filed (first pass).** D5 had not been given, so the page was returned to the driver
   as draft text only. Nothing was written to either home and neither `conventions/README.md` was
   touched. Filing unsigned would have broken the gate the brief sets.
2. **I flagged a risk in my own draft** — filing note (e): the draft's relative links were written for
   the **live** home, and the scaffold tree might not carry the targets, which would leave them dead
   there. I said this was "the one thing that could make the two homes legitimately need to differ
   (which dual-home-parity forbids)".
3. **D5 was signed** (2026-07-27, "Sign it — file dual-homed"), and I checked the risk before writing.
   **It fired, and it is structural, not incidental:**
   - `claude/scaffold/…/decisions/adr-029-…` — **MISSING**;
     `claude/scaffold/…/reports/2026-07-26-…` — **MISSING**;
     `claude/scaffold/…/conventions/task-status-vocabulary.md` — **OK**.
   - `claude/scaffold/ai-agents/knowledge-base/{decisions,reports}/` contain **only `.gitkeep`**, and
     `dual-home-parity.md:47` classifies them **project-specific — ⛔ never sync**. They will never
     hold an ADR.
   - `dual-home-parity.md:41` simultaneously requires `knowledge-base/conventions/*.md` to be
     **byte-identical**.
   - **Therefore any byte-identical convention carrying a relative link to an ADR or report is
     guaranteed to have dead links in every scaffolded project.** This is not a defect of my draft; it
     is a property of the two rules.
4. **I STOPPED and returned `NEEDS-DECISION` rather than rewording the signed page.** Rewording to
   dodge the problem would have been changing text the owner had already signed, on my own authority,
   and letting the two homes diverge would have overridden the owner's explicit dual-home ruling.
5. **The precedent decided it, and it was already in the repo.** Of the five dual-homed conventions,
   exactly one pair is byte-identical — `task-owner-vocabulary.md` — and it cites ADRs by **bare
   identifier** (`ADR-031`) with **no link**. The one whose live copy *links* `../decisions/` is
   `task-status-vocabulary.md`, and it is **diverged**: its scaffold copy states the same rule with
   the ADR links stripped out.
6. **Owner ruled Option A (2026-07-27): file byte-identical with bare citations.**

**So the page cites `ADR-029` and the decision report as PLAIN TEXT, not links — deliberately.** A
future reader must not "fix" this by adding links: doing so re-breaks the scaffold copy. The single
surviving link, `task-status-vocabulary.md`, was verified present in **both** trees. No other word of
the signed page changed — not the rule, the rationale, either table, the "what NOT to rewrite" list,
or the enforcement sites.

**Filed:**
- `ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` and
  `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` —
  **byte-identical**, proved by `diff` (empty) and matching SHA-256
  `d1f756af928dc919d17a4e7ae0527f68c2be771a5e91090af81085a773bb9fb3`. Written from a single source
  file and copied to both homes, so identity is guaranteed by construction rather than by hand.
- Index row added to **both** `conventions/README.md` "What's here" tables. The live table keeps
  `dual-home-parity.md †` last (it is fkit-repo-only), so the new row sits before it. **The
  pre-existing live↔scaffold README divergence was NOT reconciled** — that is task 0132/0133's scope,
  and the two READMEs still differ, as intended. Note `dual-home-parity.md:42` already records the
  "What's here" index as *the one intentional exception* to README byte-parity.
- Scaffold README line 25 **"Five conventions ship with the scaffold" → "Six"**. Verified the claim
  now matches reality: claim `Six`, actual convention files 6, actual table rows 6.
- Sign-off line in `dual-home-parity.md`'s own form (`"Approved by the owner on 2026-07-19, from …"`):
  **"Approved by the owner on 2026-07-27, from `reports/2026-07-26-decide-task-folder-name-numeric-prefix.md` (task 0103)."**

**The three previously-dead links now RESOLVE** — re-checked explicitly by resolving each against its
own file's directory: `claude/skills/fkit-status/SKILL.md:303`,
`claude/skills/fkit-task-brief/SKILL.md:279` and `:292`, all **OK**. **No test covers this**; it was
verified by hand, and it would silently rot again if the page were moved or renamed.

> One cosmetic note so a reviewer does not report it as a defect: a naive link-extractor flags `…` as
> a broken target in the page. That is the ellipsis placeholder inside the quoted marker
> `➡️ Moved to [Sprint N](…) — priority M`, which is **verbatim the idiom already in
> `task-status-vocabulary.md:21` in both homes**, inside a code span. It is not a link.

### Final verification after filing

| Check | Result |
|---|---|
| `diff` of the two homes + SHA-256 | **byte-identical**, identical checksums |
| Every real link in the page, resolved in **both** trees | `task-status-vocabulary.md` **OK** in both; **zero** broken |
| `diff -rq ai-agents/ claude/scaffold/ai-agents/` (dual-home-parity's own command) | new page reports **no divergence** |
| The three skill links | all **OK** |
| Scaffold README count vs reality | claim 6 = files 6 = rows 6 |
| `bash claude/fkit-claude-init.sh .` then mirror check | all three touched files **IN SYNC** |
| `npm test` | **523/523 pass, 0 fail**; `prove-red.sh` hard gate **PASSED** |
| Drift vs step-0 baseline | **UNCHANGED** — sprint-2 0→0, backlog 0→0, **sprint-1 7→7** |
| Href changes on the board files | **none** — every link target unchanged in both |

### Still not done when this task closes

All seven items of report §8 are implemented. What remains is **not this task's**, and is recorded so
it is not mistaken for an omission:

- **Wiki resync** of vault pages narrating the old priority-keyed rule (`drift on tasks 59, 60` and
  similar). The coder may not write `ai-agents/wiki-vault/`, and §8 item 7 forbids it here. **A
  wiki-role job**, and it is now genuinely owed — the narration those pages mirror has changed.
- **`test/dual-home-parity.test.js` does not exist** (task 0133). The new page's byte-parity is
  therefore held by *this worklog and a manual `diff`*, not by a test. If the two copies drift, nothing
  fails.
- **No link-checking test exists** anywhere. The three skill links into the new convention page, and
  the page's own link, were verified by hand this session and would rot silently.
- The pre-existing live↔scaffold `conventions/README.md` divergence stays unreconciled — **task
  0132/0133**, deliberately untouched here.

---

## Review round 1 — processed 2026-07-27 (`fkit-process-stateful-review`)

Reviewers: **fkit-reviewer (Claude)** + **Codex adversarial pass** (`codex-cli 0.145.0`, exit 0) —
**full model-diverse coverage, not degraded.** Verdict: *changes requested, 5 defects, none blocking,
**zero code defects***. The reviewer independently re-executed the numeric guard, the four-arm ladder,
the two-directional red-proof, the awk admission window and the label regex — all correct. It endorsed
two things explicitly: the refusal to claim 5/5 on the red-proof ("honest and correct"), and the mover
qualifier ("exemplary — the opposite of the failure mode"). The `:1735` widening was judged **strictly
stronger** than what it replaced.

**Every finding was verified against the actual files before any edit. All five were accurate as
written; none was disputed and none re-litigated a settled decision.** Verdicts and actions are in
`review.md`'s *Coder response* table. Summary:

| # | Sev | Outcome |
|---|---|---|
| R1 | medium | **Fixed** — the page now says on its face why `ADR-029` and the report are cited bare, and what test to apply before adding a link. Both homes, byte-identity re-proved. |
| R2 | medium | **Fixed** — `plan.md` back-filled with steps 0, 2b, 6, 4, 7, 8 under a dated back-fill banner; §10's prescribed text, the E11 conflict, the three-word scope and the owner's ratification all recorded; the `:294`/`:287` mismatch resolved on both sides. |
| R3 | low | **Fixed** — `status-report-format.md`'s `#` and `Filename` rows corrected in **both homes**; they were false on 130/130 sprint rows and 16/16 backlog rows. |
| R4 | low | **Fixed** — `SKILL.md:301` no longer contradicts ladder arm 2. |
| R5 | low | **Accepted as residual** (owner ruling) — instruments deliberately not back-filled; recorded in the ledger with the one claim that stays unverifiable. |

### A fresh defect I introduced while fixing R1, and caught myself

Writing R1's note, I linked `[`dual-home-parity.md`](dual-home-parity.md)` — **which is
fkit-repo-only and ships to no project**, so that link would have been **dead in the scaffold copy: the
exact bug R1 exists to prevent, reintroduced inside its own fix.** Caught by checking the scaffold
inventory before syncing, and corrected to a bare citation. Recorded because the driver flagged that
fix rounds on this sprint have twice introduced fresh defects, and this is the third — caught only by
the author's own re-verification, not by any test.

### Re-verification after the fix round

| Check | Result |
|---|---|
| Convention page byte-parity | **BYTE-IDENTICAL**, SHA-256 `340ab5cbae45e3390a80e15ceb3e8f20e92e03764e3b0c5960fe273c99e781ca` on both (changed from `d1f756af…` by R1's note — expected) |
| Every relative link in **every** conventions file, **both** homes | **zero broken** |
| The three skill links | all **OK** (`fkit-status/SKILL.md:304` — shifted from `:303` by R4's edit — and `fkit-task-brief/SKILL.md:279`, `:292`) |
| `status-report-format.md` table rows across homes | **byte-identical**; pre-existing **header** divergence byte-for-byte **unchanged** and **not reconciled** (0132/0133) |
| New divergent files introduced | **none** — the divergent set is the same five pre-existing files |
| Trap A end-state `grep 'Priority number'` | still returns **nothing** |
| `bash claude/fkit-claude-init.sh .` + mirror check | all three touched files **IN SYNC** |
| `npm test` | **523/523 pass, 0 fail**; `prove-red.sh` hard gate **PASSED** |
| Drift vs step-0 baseline | **UNCHANGED** — sprint-2 0→0, backlog 0→0, **sprint-1 7→7** |
| Href changes on the board files | **none** |
