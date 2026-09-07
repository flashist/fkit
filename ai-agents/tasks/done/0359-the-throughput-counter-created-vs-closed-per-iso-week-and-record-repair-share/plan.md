# Plan — Task `0359`: the throughput counter (created vs closed per ISO week, plus the record-repair share)

**Baseline for this plan: HEAD `cf289c2`.** Every number below was measured firsthand this turn. The working tree carries ~29 renamed task folders and 11 untracked new ones that are **not mine** — three sweeps' worth of closes, ADR-046, six new briefs, and two modified test files. My change surface will be exactly three files (§6).

---

### 0. Four corrections to the brief's premises, measured firsthand

These change the plan's shape, so they lead.

**0.1 ⛔ The brief's stated cost of putting the file under `claude/` does not exist for the location I propose.**

The brief says a file under `claude/` "engages the install share's structure-spec and hash manifest — `test/structure-spec.test.js`, `test/structure-manifest.test.js` and `claude/skills/fkit-heal/check.sh` all have to learn about it."

I checked all three. **All are scoped to the *consuming project's* `ai-agents/` scaffold, not to `claude/` internals:**

- `test/structure-spec.test.js` reads `claude/structure-spec.md`, `claude/scaffold/ai-agents/`, `claude/structure-manifest.tsv`. Its spec file's own title is *"what the installed version requires of a consuming project"*.
- `claude/structure-manifest.tsv` — 91 lines; every path is `CLAUDE.md`, `AGENTS.md`, or under `ai-agents/`. **Zero `.sh` entries.** `dashboard.sh` is not in it.
- `claude/skills/fkit-heal/check.sh` — walks the project's `ai-agents/` subtree against the share scaffold copy.
- `test/dual-home-parity.test.js` — compares `ai-agents/` against `claude/scaffold/ai-agents/`. Not `claude/skills/`.

**So a script in `claude/skills/fkit-status/` engages none of them.** The brief's framing was right for a file under `claude/scaffold/ai-agents/` and wrong for a file beside `dashboard.sh`.

**0.2 ⭐ `bin/` does not ship. This is decisive, and it inverts the brief's lean.**

`install.sh` copies exactly one tree:

> `cp -R "$TMP/src/claude" "$SHARE/claude"`

`bin/` is never fetched into the install share. A consuming project has no `bin/release.mjs` and would have no counter. The task's second half amends `/fkit-status` to **name the script as the source of a measured trend claim** — and a `/fkit-status` run in a consuming project would then name a file that does not exist there. That is the brief's own half-ship failure in a different costume.

**Precedent is already established:** `claude/skills/fkit-status/dashboard.sh`, `claude/skills/fkit-heal/check.sh`, `claude/skills/fkit-heal/repair.sh`. No test asserts a skill directory holds only `SKILL.md`.

**0.3 ⛔ A pathspec narrowed to `done/` silently destroys rename detection.** This is the Sweep C R4 lesson, and it reproduces exactly:

| Command shape | Renames `backlog/…/brief.md` → `done/…/brief.md` found |
|---|---|
| `git log --name-status -- 'ai-agents/tasks/done/*/brief.md'` | **0** (all 228 reported as `A`) |
| `git log --name-status -- 'ai-agents/tasks/'` | **133** |

Git cannot see the source side of a rename when the pathspec excludes it. **The script must diff over the whole `ai-agents/tasks/` tree and filter in-process.** `--no-renames` and a narrow `--diff-filter` are both wrong answers to a different question, exactly as the driver warned.

**0.4 ⚠️ Reproducing `45` does not validate the classification rule.** Measured at the baseline revision (§2), **two different verb sets both yield exactly 45**:

```
45  <- correct|repair|record|append|fix|amend|backfill|gloss
45  <- correct|repair|record|append|fix|amend|backfill|reconcile
```

And a **third, shorter set yields 42 directly** — `correct|repair|record|append|fix` plus `amend` — which is *not* the brief's 42. The brief's 42 is *45 minus three named source-defect rows*. **Two arithmetically identical 42s reached by different rules, and the 6-verb one includes all three rows the other excludes.** An implementer who "reproduces 42" via the short set has reproduced the number and missed the rule. Verification step 2 must therefore check **both** figures *and* the row lists, never the percentages alone.

---

### 1. The two deliverables, restated as what actually gets written

1. **`claude/skills/fkit-status/throughput.mjs`** — new. The counter.
2. **`claude/skills/fkit-status/SKILL.md`** — amended. The beat-1 headline cell of the Backlog board.
3. **`test/throughput-counter.test.js`** — new. Unit + fixture-git coverage under `node --test`.

Plus one line appended to `test/prove-red.sh` (§5.3).

**⛔ `claude/skills/fkit-status/dashboard.sh` is not touched.** Not one byte. `test/dashboard-contract.test.js` proves it.

---

### 2. The anchor revision — how the baseline becomes reproducible at all

**⚠️ The brief's baseline cannot be reproduced against today's tree.** It was measured on disk on 2026-08-29 at *129 open task folders*. HEAD has **133**; the working tree has **112**. The corpus moved.

I found the anchor. Measured backlog folder counts by revision:

| Revision | Date | Backlog folders |
|---|---|---|
| `16754e3` | 2026-08-28 | 130 |
| `1046dc3` | 2026-08-29 | 130 |
| **`a9c2709`** | **2026-08-29** | **129** ← the baseline tree |
| `0d8b08e` | 2026-08-29 | 139 |
| `1f33b95` | 2026-08-29 | 139 |
| `c797df4` | 2026-08-31 | 137 |
| `cf289c2` | 2026-09-04 (HEAD) | 133 |

**`a9c2709` is the anchor.** The script takes a `--at <rev>` flag reading the corpus via `git ls-tree` at that revision, so verification step 2 is a *repeatable command*, not a historical anecdote. Without this flag the baseline claim is unfalsifiable forever after — which is precisely the disease this task exists to cure.

Sanity: 45/129 = 34.88% → "34.9%" ✓. 42/129 = 32.56% → "32.6%" ✓. Both brief figures are internally consistent at this revision.

---

### 3. Pinned definitions — "created" and "closed" in git terms

Derived from a full-tree `git log --name-status` walk over `ai-agents/tasks/`, rename detection on (`diff.renames` defaults true; git 2.50.1 here). Measured totals:

| Transition class | Count |
|---|---|
| `backlog/…/brief.md` → `done/…/brief.md` (R) | 133 |
| `brief.md` born directly under `done/` (true A) | 18 |
| renamed into `cancelled/…/brief.md` | 12 |
| `brief.md` born under `backlog/` (true A) | 260 |
| flat `done/*.md` → `done/*/brief.md` (migration, **not a close**) | 78 |
| flat `backlog/*.md` → `done/*/brief.md` (**is** a close) | 1 |
| `done/…/brief.md` → `done/…/brief.md` (slug rename, **not a close**) | 1 |
| pre-migration flat `backlog/*.md` → `done/*.md` (**are** closes) | 72 |

**Definitions, written into the script's header:**

- **Identity.** Post-migration: the task-folder `NNNN` prefix. Pre-migration: the flat filename stem (no ID existed — IDs were assigned *by* the migration).
- **Created** = the first commit in which that identity's brief first appears anywhere under `ai-agents/tasks/`, as an `A`, and not as the target of an `R`.
- **Closed** = the first commit in which that identity's brief appears under `done/` or `cancelled/` — **whether it arrived as `R` from `backlog/` (133 + 12) or as `A` born already closed (18).**

⭐ **Those 18 born-closed rows are not noise, they are the batch-commit signature of this repo.** A task created and closed between two "Sprint push" commits never exists under `backlog/` in any committed tree. A counter that only counts renames undercounts closes by 18 and reports zero creations for those tasks. Both counts land in the same ISO week — correctly, because from git's point of view that is when both events became true.

- **Not a transition, excluded by name:**
  - the 78+1 migration renames at `331f298` where the **board segment is unchanged** and only the *shape* changed (flat `.md` → folder `brief.md`);
  - the 1 `done`→`done` slug rename.

  ⛔ Without this exclusion the migration week (**2026-W30**) reports a false spike of ~78 closes. That is the brief's *"silently wrong counts are not"* failure, and it is one commit wide.

- **Horizon.** Not a cutoff — the pre-migration era is **counted**, by path identity, because 72 real closes live there. What the script states explicitly is that before `331f298` (2026-W30) a task has no ID, so per-week counts are available but per-ID drill-down is not. The migration commit itself contributes zero closes and zero creations.

**ISO week.** `%G-W%V` via `git log --date=format:` works on this box but is strftime-and-platform-dependent. **I will not rely on it.** The script reads `--date=iso-strict` and computes the ISO week in ~10 lines of JS (Thursday-of-week algorithm). Deterministic, no dependency, no platform variance.

---

### 4. The record-repair rule — the deliverable, not a footnote

**The rule, written as a literal at the top of the script with a prose reason per verb:**

A task folder is a **record repair** when the leading token of its slug (after the `NNNN-` prefix) is in a pinned, sorted verb list — work whose subject is *the project's own written record* rather than its behaviour.

Candidate set (to be pinned at build time by walking all 129 rows and reading each title, not by curve-fitting to 45): `amend, append, backfill, correct, fix, gloss, record, repair` — plus whichever eighth reproduces the row list, **chosen by reading the rows, not by matching the count** (§0.4).

**Two named exceptions, hard-coded with reasons:** `0215`, `0234`, `0334`. All three carry repair-class leading verbs (`repair`, `fix`, `fix`) and all three repair **genuine source defects**, not records. All three are present in backlog at `a9c2709`, verified. **This is not derivable from the slug** — it needs a human judgement, so it lives in the script as a named list with a one-line reason each, and the script prints them under a `noted exceptions` heading so a disputed row is visible rather than silently reclassified.

**⛔ No cap on process work.** The script reports the record-repair share and nothing else as a share. It emits no budget, threshold, or over/under verdict for any other class. The owner's ruling capped record repair only.

**`--list` mode** prints every open row with its classification, the matched verb, and whether an exception fired — so any single row can be checked by hand.

---

### 5. Testability under ADR-014 — the seams, named

**5.1 Pure-function seam.** The script exports `classify(slug)`, `isoWeek(isoDate)`, and `foldTransitions(nameStatusRecords)` as pure functions. `test/throughput-counter.test.js` unit-tests each against literal fixtures — no git, no filesystem. This is where the migration-rename exclusion, the born-closed case, and the exception list get their assertions.

**5.2 Root/rev seam.** `--repo <path>` and `--at <rev>`, mirroring the `root`-parameter pattern the citation guard adopted as its D3 decision (*"`root` is a parameter, not `process.cwd()` — that is D3, and it is the whole fixture strategy"*). The test builds a **throwaway git repo in `os.tmpdir()`** with a scripted history — create in backlog, `git mv` to done, one born-closed task, one flat→folder migration rename — and asserts the counts. This is what proves the git-reading half without depending on the live corpus, whose numbers change weekly.

**5.3 prove-red.** ⭐ **A counter under `claude/` is reachable by the seam that already exists.** `test/prove-red.sh`'s mutation 14 already mutates `dashboard.sh` inside a full throwaway copy of `claude/` pointed at by `FKIT_LAUNCHER`. A sibling script in the same directory rides the same copy. I will add **one mutation** — invert the migration-rename exclusion — which must turn the named assertion red. Under `bin/` this would need a fresh env seam of its own (`FKIT_RELEASE_MJS` is the precedent), so `claude/` is cheaper here too.

**5.4 `npm test` membership.** ⭐ **Recommendation: the *tests* join `npm test`; the *script* does not run in it.** `test/throughput-counter.test.js` matches `test/*.test.js` and is picked up automatically. But the counter must **never** be asserted against the *live* corpus in CI — the live numbers change every time a task closes, so a live-corpus assertion is a test that goes red for being correct. All live-corpus reads are `t.diagnostic`, never `assert`. Assertions run against `os.tmpdir()` fixtures and the pinned `--at a9c2709` baseline only.

---

### 6. Output shape — a new producer, not a change to the old one

Mirrors `dashboard.sh`'s framing so a status run can quote it, with **its own markers** so nothing that parses the dashboard sees a new token:

```
⟦fkit-throughput v1⟧
⟦WEEKS⟧
week 2026-W30 created 12 closed 3
week 2026-W31 created 8 closed 14
...
⟦REPAIR⟧
open 129
repair 45
repair-pct 34.9
repair-excluding-source-defects 42
repair-excluding-source-defects-pct 32.6
exception 0215 repairs-source-defect
exception 0234 repairs-source-defect
exception 0334 repairs-source-defect
⟦END⟧
```

`dashboard.sh` emits `⟦fkit-dashboard v1⟧ / ⟦BOARD⟧ / ⟦FACTS⟧ / ⟦END⟧` and keeps them, untouched.

---

### 7. The `/fkit-status` amendment

Target: the Backlog board's beat-1 headline cell in `claude/skills/fkit-status/SKILL.md`, under the heading for the Backlog board's beats, currently reading:

> *"**Do not say whether the backlog is growing or shrinking** — you are reading one snapshot, and the source set has no history to ground a trend in."*

Proposed replacement (exact wording is the plan's, open to the owner):

> *"**Do not say whether the backlog is growing or shrinking from this snapshot** — one board render has no history to ground a trend in. **You may state a measured trend, and only a measured one**: run `bash .claude/skills/fkit-status/throughput.mjs`, quote its per-week created/closed figures, and name it as the source in the same sentence. An unsourced growth or shrink claim stays forbidden."*

**⛔ The teeth survive.** The banned act — asserting a trend from a snapshot — is still banned in the first clause. What is lifted is narrow and conditional: a claim *carrying its measurement and its source*. A rewrite that merely deleted the ban would fail this task, and this is not that.

Invocation form is `bash <path>`, never `./throughput.mjs`, for the reason `dashboard.sh`'s own header gives: `install.sh` chmods a hardcoded list of two filenames and this is not on it.

---

### 8. ⭐ The citation-policy guard — how this task's own records stay green

**Discharging the relayed owner ruling *"Carry it into each sweep's plan gate (Rec)"*.** This is not a sweep, but the guard does not care: `test/coordination-citation-policy.test.js` scans `ai-agents/tasks/*/*/*.md` and exempts **closed task folders only**. `0359` is open, so **this task's own `plan.md`, `worklog.md` and `review.md` are in the scanned set while it runs.** Point 11 of the guard's header records that an open `review.md` is scanned and not exempt, and that exempting it was **refused by name** on 2026-09-02.

**I adopt Sweeps A, B and C's discipline unchanged: heading + quoted fragment, never the coordinate.** No adaptation, no departure — the guard is byte-identical for me and for them, and inventing a fourth style here would be novelty for its own sake.

Rejected by name, same as the sweeps did:

- ⛔ **The split-cell dodge** — splitting a coordinate across table cells to slip the matcher. It defeats the guard without fixing the citation, and the durable-citation convention names a cell-spanning phrase as *unverifiable by this method* rather than absent.
- ⛔ **Fence and blockquote hiding** — `maskFencesAndQuotes` blanks fenced and `>` lines, so a banned coordinate parked in one goes unseen. Using that is writing the defect where the guard cannot look.

⚠️ **One live trap worth stating: backticks do not hide anything.** The guard's `maskCodeSpans` is **deliberately absent** (owner ruling 2026-09-02, *"Omit, assert positively (Rec)"*). Wrapping a coordinate in backticks leaves it fully matchable. This plan text, the script's comments, and the skill edit all carry zero `path:NNN` coordinates into a coordination document.

I will run the guard against the tree before hand-off, not merely assert it.

---

### 9. Sequencing

1. Pin the verb set by **reading all 129 rows at `a9c2709`** and recording the judgement per row. (Not curve-fitting — §0.4.)
2. Write `throughput.mjs`: pure functions first, then the git walk, then output.
3. Write `test/throughput-counter.test.js`: unit fixtures, then the `os.tmpdir()` git fixture, then the pinned `--at a9c2709` baseline assertion.
4. Run `--at a9c2709`; confirm 129 / 45 / 42; **diff the row lists** against the brief's reading.
5. Amend the `/fkit-status` line.
6. Add the prove-red mutation; run `test/prove-red.sh` and **report the red run**.
7. Full `npm test`; `test/dashboard-contract.test.js` green and `dashboard.sh` byte-unchanged (`git diff --stat` proves it).
8. Run the citation guard; run the link guard.
9. `git diff --stat`: zero files under `ai-agents/wiki-vault/`, zero task folders moved by me.

---

### 10. ⛔ The mid-flight corpus — what the script reports today, and what it means for `0360`

**This is the part `0360` cannot ship without, so it is stated plainly rather than left to the close report.**

HEAD is `cf289c2`. Since then the working tree holds **29 renamed task folders and 11 untracked new ones, uncommitted**. **A git-history counter cannot see any of them** — git history is the committed record, and those closes are not in it.

Measured this turn, using the candidate 8-verb rule:

| Corpus | Open folders | Record-repair | Share |
|---|---|---|---|
| Baseline `a9c2709` (2026-08-29) | 129 | 45 / 42 | 34.9% / 32.6% |
| **HEAD `cf289c2` (what the script reports today)** | **133** | **40** | **30.1%** |
| **Working tree on disk (uncommitted)** | **112** | **22** | **19.6%** |

**⚠️⚠️ Both readings miss the sprint's success criterion.** The sprint's own criterion table names *"42 of 129 open task folders = 32.6%"* as the baseline and *"under 10% of open work"* as the target. 19.6% is the most favourable honest reading available, and it is roughly double the target. The gap is far too wide for any plausible verb-set adjustment to close — reaching 10% needs ≤11 repair rows of 112, against 22 measured.

**⛔ I am not adjusting a number to fit.** The brief's own instruction governs: *"If it matches neither, that is a finding to report, not a number to adjust."* The same discipline applies to the target.

**Consequences for `0360`, which must carry the measured outcome in its archival banner:**

1. **`0360` cannot honestly run before Sprint 7's closes are committed.** Run today, the counter reports HEAD's 30.1% — a figure that understates the sprint's actual progress by ignoring ~40 folders that have moved on disk. The banner would be measured, sourced, and misleading.
2. **The honest sequence is: commit the sprint's closes → run the counter → `0360` reads it → cut the release.** The commit is the owner's; I neither commit nor push.
3. **The banner will read "missed", not "met."** That is a real outcome, not a defect in the counter — and it is exactly what "makes Sprint 7 falsifiable" was supposed to buy. A criterion that could only ever come back "met" was never a criterion.

---

### 11. Risks and edge cases

- **Rename-detection thresholds.** Git scores renames by similarity; a `brief.md` heavily rewritten in the same commit as its move can drop below the default 50% and split into A+D. Measured `R099` on the sample, and the 133/18 split reconciles against 228 done folders within 2 — I will reconcile that residual of 2 exactly and report it rather than round it away. Mitigation if needed: `-M20%` with the looser threshold stated in the header.
- **Merge commits** — none in this history (linear), but the walk will pass `--no-merges` explicitly so a future merge cannot double-count.
- **A task closed, reopened, re-closed** — first-close-wins by definition; a reopen shows as a later `R` back into `backlog/`. The script counts the *first* close and notes reopens separately rather than silently dropping them.
- **`--at <rev>` with a dirty tree** — `git ls-tree` reads the revision, never the worktree, so the flag is honest by construction. The default (no flag) reads HEAD, also not the worktree, and the output says which.
- **The verb rule is a proxy, permanently.** A leading verb is not a category. The `--list` mode and the named-exception list are the accountability, not a claim of accuracy.

---

### 12. Constraints honoured

⛔ No commit, no push. ⛔ Nothing written under `ai-agents/wiki-vault/`. ⛔ No mover invoked, no task folder moved, no board row flipped, no `## Status` changed. ⛔ The gitignored `.claude/` mirror is never edited — I edit canonical `claude/` only, and ⛔ **I will not report any `claude/` change as live in this session**, since init has not been re-run. ⛔ No new devDependency; `package.json` unchanged. ⛔ `dashboard.sh` byte-unchanged.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-07

Given live via `AskUserQuestion` in this `fkit lead` session. Option labels recorded **verbatim**.
These bind the Build and Process-review workers.

| # | Question | Owner ruling (verbatim option label) | What it settles |
|---|---|---|---|
| **W0** | Approve this plan as written? | **"Approve as written (Rec)"** | The plan above is the approved plan. These bytes are what the Build worker implements. |
| **W1** | Q1 — where does the script live? | **"claude/skills/fkit-status/ (Rec)"** | ⭐ **`claude/skills/fkit-status/throughput.mjs`.** The owner's reasons: `install.sh` copies **only** `claude/`, so this is the **only** location where the amended `/fkit-status` line names a script that exists in a consuming project; it is precedented by `dashboard.sh` and `fkit-heal`'s two scripts; it engages no manifest; and it reuses prove-red's existing `claude/`-copy seam. ⛔ **This departs from the brief's stated lean, on a premise §0.1 measured as false.** |
| **W2** | Q2 — the pre-migration era | **"Count it by filename identity (Rec)"** | ⭐ **Counted, by flat-filename identity.** 72 real closes live before `331f298`; discarding them throws away roughly a third of the history the sprint wants a trend from. ⛔ Per-week counts are exact; **per-ID drill-down is unavailable pre-migration and the script must say so.** |
| **W3** | Q3 — reproduce the baseline against which corpus? | *Not put to the owner — folded in by the driver as measured fact* | ⭐ **`--at a9c2709`.** ⛔ Not a preference: the live tree has **133** at HEAD and **112** on disk against the **129** the baseline needs, so a live-corpus check **can never pass again**. The `--at` flag is the only form of verification step 2 that is repeatable. Recorded here so a later reader sees it was measured, not chosen. |
| **W4** | Q4 — the sprint misses its criterion | **"Report the miss, both figures, source named (Rec)"** | ⭐ **`0360`'s banner reports the MISS**, carrying both readings (**30.1%** at HEAD, **19.6%** on disk) against the **10%** target, with the counter named as source. The owner's reason: the counter was built to make the claim falsifiable, and **suppressing the first thing it falsifies would waste the task.** ⛔ No number is adjusted to fit. |
| **W5** | Q5 — sequencing against the uncommitted closes | **"Commit the closes, then run, then 0360 (Rec)"** | ⭐ **The honest sequence: owner commits Sprint 7's closes → run the counter → `0360` reads it → cut the release.** ⛔ Run before that commit, the banner would be **measured, sourced, and misleading** — understating the sprint by ignoring ~40 moved folders. ⛔ **No agent commits; the commit is the owner's.** ⛔ The `--worktree` alternative was refused: it would stop the headline number being a git-history figure, which the brief requires. |
| **W6** | Q6 — the `/fkit-status` replacement wording | **"Approve the draft (Rec)"** | ⭐ **§7's draft ships as written.** ⛔ **The teeth survive** — asserting a trend from a snapshot stays banned outright in the first clause; what is lifted is narrow and conditional, a claim **carrying its measurement and naming its source in the same sentence.** ⛔ A rewrite that merely deleted the ban fails this task. |

⚠️ **Transport note.** This plan text was returned to the driver through the spawn channel, which HTML-escaped some angle brackets. The driver restored `&lt;`/`&gt;` to `<`/`>` when persisting these bytes — in §2 (`--at <rev>`), §5.2 (`--repo <path>`), §7 (`bash <path>`), §11, and §0.4's fenced verb-set block. No other character was altered. Recorded so a later reader does not read the restoration as drift.
