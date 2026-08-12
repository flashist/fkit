# Worklog — task 0267

Correct the five remaining prose sites that state the glob as the mechanism.

**Build worker**, spawned by `/fkit-sprint-ship-loop` (lead session) under the declared-approval
marker. Plan approved by the owner 2026-08-12 via `AskUserQuestion` in the driver session.
Plan pointer verified on disk at the start of this spawn: `plan.md`, blob
`9767efd2e432185925db97da34ff292480d7f805`, 17431 bytes — matches the pointer the driver reported.

---

## What was built (2026-08-12)

Six prose edits across four files, all taken **verbatim from the approved plan**. No behaviour
change, no new step, no new gate, no test added, no commit.

| Edit | File | Site | What changed |
|---|---|---|---|
| 1 | `claude/skills/fkit-task-brief/SKILL.md` | ADR-041 §6 site 3, `:310-312` | The generator's `<short header: …>` placeholder for a fresh `backlog.md`. Stops claiming the filename is what excludes the board; states identity-`Backlog`-never-eligible, and gives the real reason the name is kept (the `➡️ Moved to [Backlog](backlog.md)` href). Still a `<short header: …>` placeholder — generator contract unchanged. |
| 2 | `claude/skills/fkit-task-brief/SKILL.md` | ADR-041 §6 site 4, `:334-337` | The "never write a `sprint-backlog.md`" rule. **First sentence kept byte-identical**; only the reason replaced — one-board / href-breakage, plus the explicit correction that such a file would *not* become the active sprint. Carries the new ADR-041 §2 link (owner ruling 4: keep). |
| 3 | `claude/skills/fkit-sprint-ship-loop/SKILL.md` | ADR-041 §6 site 5, `:46-48` | Argument gloss. Empty `$ARGUMENTS` now points at `fkit-status/SKILL.md`'s empty-argument rule rather than restating a glob, with ADR-041 §5's "do not re-derive" constraint named. |
| 4 | `claude/skills/fkit-sprint-ship-loop/SKILL.md` | ADR-041 §6 site 6, `:93` | Step 1's first bullet: "the active `sprint-*.md`" → "the active sprint as `/fkit-status` resolves it". |
| 5 | `ai-agents/sprints/backlog.md` | ADR-041 §6 site 7, `:7-11` | This repo's live backlog board header. Identity-based exclusion, ADR-041 §§2–3 link, "stronger than the filename rule it replaced" (mirrors 0266's landed wording in `fkit-status/SKILL.md`), href reason for the name. **A separate act from Edit 1** — Edit 1 fixes what the generator *writes*, Edit 5 fixes what this repo's board *says*. |
| 6 | `README.md` | landing site, inserted after `:33` | New paragraph after the `**Staying current:**` block, per the owner's 2026-08-10 ruling ("README.md — exists today, right audience"). Tells downstream projects that an update refreshes `.claude/` but never rewrites their own `ai-agents/` content, so an already-generated backlog header stays stale prose — not broken behaviour. |

**Sequencing:** `fkit-sprint-ship-loop/SKILL.md` (Edits 3 and 4) was written **last**, per the plan's
own recommendation, so the driver's reads stayed stable through the earlier work.

## What was deliberately NOT done

- ⛔ `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md:28` and its
  live twin — **not edited, in either home** (owner ruling 3). The eighth-site candidate is a locator
  gloss, not a §6 site.
- ⛔ The brief's verification step 3 text — **not edited** (owner ruling 2). Its three-zone prediction
  is factually wrong; that is reported, not papered over.
- ⛔ No `fkit-status/SKILL.md` edit, no `dashboard.sh` edit, no `backlog.md` rename, no
  `structure-spec.md` edit, no `npm run generate:manifest`, no new test, no commit, no push.
- ⛔ `plan.md` was **not** re-authored — the driver wrote it at approval.

## Sanity checks run in this spawn (full verification is a separate spawn)

- `git diff --stat` — my change surface is exactly the four planned source paths. Everything else in
  the tree (`claude/skills/fkit-status/SKILL.md`, the moved `0266` folder, `sprint-5.md`, the `0265`
  and `0267` brief edits) is 0266's shipped work or the driver's `🔄 In progress` marks. Not mine.
- All three new ADR-041 relative links resolve to a real file from their own directory
  (`claude/skills/fkit-task-brief/` → `../../../`, `ai-agents/sprints/` → `../`, repo root → `./`).
- Root `README.md` is **not** in `claude/structure-manifest.tsv` (only `ai-agents/*` READMEs are) and
  `claude/scaffold/README.md` does not exist — so no manifest regen, confirming the plan's finding.
- Edit 2's first sentence confirmed byte-identical in the diff.

---

## Decision log — decisions taken without asking

**Fixes applied without asking: none. Obvious-winner calls: none.**

Every one of the six edits is the approved plan's own text, applied verbatim; nothing was widened,
narrowed, reworded, or invented. Three items were *observations* rather than decisions, recorded here
so they are findable:

1. **Site 3's anchor drift was already reconciled in the plan** (`:310-312`, not the brief's dated
   `:308-312`). No call was needed at build time — all six edits were applied by exact string match,
   never by line number, so a stale anchor could not have mis-targeted an edit.
2. **`ai-agents/sprints/backlog.md`'s historical rows shifted `:119,:122` → `:121,:124`** because
   Edit 5 added two lines. Row content untouched; the plan's step-3 accounting table should be read
   with that +2 offset.
3. **Edit 6 introduces a new `sprint-*.md` occurrence in `README.md`** — it quotes the stale sentence
   in order to name it as stale. Inherent to the approved Edit 6 text, not a deviation. Flagged
   because the plan's step-3 accounting table was written pre-edit and does not list it. `README.md`
   is outside the brief's step-3 grep scope (`claude/` + `ai-agents/sprints/`), so the sweep will not
   surface it on its own.

## Residuals carried forward, reported not fixed

- **`fkit-sprint-ship-loop` step 1 still has no executable path when `$ARGUMENTS` is empty.** The
  replacement points at `fkit-status`'s rule, as ADR-041 §5 requires; giving the loop its own
  `dashboard.sh select-active` call would be a **new step**, forbidden by this brief. Candidate
  follow-up — **not filed**.
- **The eighth-site candidate** in `priority-is-rank-not-identity.md:28` (both homes) — assessed as
  *not* an ADR-041 §6 site; owner ruled report-don't-edit.
- **Verification step 3's three-zone prediction is wrong** and cannot pass as literally worded. The
  plan's accounting table (with the +2 offset above, plus the new `README.md` hit) is what satisfies
  its substance.

---

# Verification (2026-08-12) — separate spawn, `fkit-sprint-ship-loop` Verify worker

Verification only. **No implementation. Nothing was edited to make a check pass.** The three owner
rulings carried into this spawn (step 3 = satisfy-the-substance-report-the-flaw; the eighth-site
candidate = report-don't-edit; Edit 2's ADR-041 §2 link = keep) were treated as settled and not
re-opened.

**Result: PASS on every check that can pass. One check — the brief's verification step 3 — FAILS as
literally worded and cannot pass; its substance is satisfied and the flaw is reported, per owner
ruling.**

## 1. `npm test` — PASS

Run twice (the first run's exit code was lost to a `zsh`/`PIPESTATUS` mismatch; re-run captured
cleanly). **The Build worker did not run the suite — this is its first real run since the edits.**

```
npm test REAL EXIT CODE = 0
ℹ tests 709
ℹ suites 17
ℹ pass 709
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

All 15 `prove-red.sh` mutations reddened their named assertion; all 9 baselines green.

## 2. The brief's glob sweep — SUBSTANCE SATISFIED, STEP AS WORDED **FAILS**

Command run verbatim: `grep -rn 'sprint-\*\.md' claude/ ai-agents/sprints/` (exit 0). **19 hits.**

### ⚠️ The step's stated prediction is factually wrong — and wrong in TWO ways, not one

Step 3 predicts the sweep *"returns **nothing** outside `ai-agents/tasks/`,
`ai-agents/knowledge-base/decisions/`, and `ai-agents/sprints/done/`."*

1. **Six hits survive outside all three named zones** (listed below). Not fixable without editing
   historical records or a file the owner ruled untouchable.
2. **Two of the three named zones lie outside the grep's own scope.** The command scans `claude/` and
   `ai-agents/sprints/` only. It can never produce a hit in `ai-agents/tasks/` or
   `ai-agents/knowledge-base/decisions/`, so naming them as exempt zones is inert — the exemption list
   was written for a wider sweep than the command performs.

**Neither the files nor the brief's step 3 text were edited.** Full accounting instead:

| Hits | Zone | Verdict |
|---|---|---|
| `done/sprint-2.md:129,222,225,2704`; `done/sprint-3.md:61,173,180,188,189`; `done/sprint-4.md:54,99,106,166` (13) | `ai-agents/sprints/done/` | **EXEMPT** — the one named zone the grep can actually reach |
| `ai-agents/sprints/sprint-5.md:13` | live board — dated banner recording the 2026-08-10 Sprint-4 archival ruling | **historical record of what was true then.** ⚠️ Outside all three zones |
| `ai-agents/sprints/sprint-5.md:144,:147` | live board — row cells quoting `0261`/`0266`'s own brief titles | **historical row content.** ⚠️ Outside all three zones |
| `ai-agents/sprints/backlog.md:121,:124` | live board — `➡️ Moved` / `✅ Done` rows quoting `0182`/`0185`'s briefs | **historical row content on a file this task edits.** Only `:7-11` was edited. ⚠️ Outside all three zones |
| `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md:28` | the eighth-site candidate | **owner ruling 3: report, do not edit.** ⚠️ Outside all three zones, and **inside `claude/`**, where the step predicted zero |

**Zero hits under `claude/skills/`** — all seven ADR-041 §6 prose sites are now clean (1–2 by `0266`,
3–7 by this task). That is the substance the step exists to prove, and it holds.

## 3. All six edits landed — PASS (verified by reading the files, not the worklog)

`git diff` confirms each edit is on disk and matches the approved plan's text:

| Edit | File | Landed |
|---|---|---|
| 1 | `claude/skills/fkit-task-brief/SKILL.md` `:310-312` → `:310-314` | ✅ placeholder rewritten; still a `<short header: …>` |
| 2 | `claude/skills/fkit-task-brief/SKILL.md` `:334-337` → `:336-342` | ✅ rule kept, reason replaced, ADR-041 §2 link present |
| 3 | `claude/skills/fkit-sprint-ship-loop/SKILL.md` `:46-48` | ✅ Argument gloss points at `fkit-status`'s rule |
| 4 | `claude/skills/fkit-sprint-ship-loop/SKILL.md` `:93` | ✅ step 1 bullet rewritten (now two lines) |
| 5 | `ai-agents/sprints/backlog.md` `:7-11` → `:8-13` | ✅ identity-based exclusion + ADR-041 §§2–3 link |
| 6 | `README.md` after `:33` | ✅ 12-line downstream-exposure paragraph |

**Site-3 anchor drift re-confirmed independently at HEAD:** `:307` is the ` ```markdown ` fence,
`:308` the `# Backlog` title, `:309` blank, **`:310-312` the placeholder**. The brief's dated
`:308-312` was stale; the plan's re-verification to `:310-312` is correct. *(Trivial inaccuracy noted:
the plan's prose glosses the fence as `:308` and the title as `:309` — both one line high. The range
it acted on, `:310-312`, is right, and every edit was applied by exact string match, so nothing could
have been mis-targeted. Not a defect.)*

## 4. Edit 2's first sentence BYTE-IDENTICAL to HEAD — PASS (proved, not asserted)

The rule sentence is 78 bytes. Compared HEAD's line 334 against the worktree's line 336 over exactly
those 78 bytes:

```
RESULT: BYTE-IDENTICAL (cmp exit 0) over all 78 bytes
- **⚠️ Never file against `backlog.md` by writing a `sprint-backlog.md`.**   <-- ends here
```

The rule survives verbatim; only the reason after it changed. Brief verification step 6 satisfied.

## 5. All three new ADR-041 relative links resolve — PASS

Each resolved from its **own** directory, at three different depths:

- `claude/skills/fkit-task-brief/` + `../../../ai-agents/knowledge-base/decisions/adr-041-…md` → resolves (27948 bytes)
- `ai-agents/sprints/` + `../knowledge-base/decisions/adr-041-…md` → resolves (27948 bytes)
- repo root (`README.md`) + `ai-agents/knowledge-base/decisions/adr-041-…md` → resolves (27948 bytes)

The `../../../` depth matches **11 existing** `../../../ai-agents/knowledge-base` links already in
`fkit-task-brief/SKILL.md`, and holds identically in an installed project
(`.claude/skills/fkit-task-brief/` → up 3 = project root).

## 6. `priority-is-rank-not-identity.md` — PASS (untouched, both homes still identical)

```
cmp exit 0 -> BYTE-IDENTICAL between homes
b7cc3845bb0e0e678e2b768cbbd951f7f655514cc32429d7d4499d7b812a894f  ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md
b7cc3845bb0e0e678e2b768cbbd951f7f655514cc32429d7d4499d7b812a894f  claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md
IDENTICAL TO HEAD (git diff --quiet exit 0)
```

Owner ruling 3 honoured: reported, not edited, in either home.

## 7. No manifest regen needed — PASS

- `claude/structure-manifest.tsv` is **not** in `git status --porcelain` and **not** in `git diff --name-only` (0 matches).
- Ran `npm run generate:manifest` as a control: *"wrote claude/structure-manifest.tsv — 65 entries"*,
  and the tree stayed **clean** afterwards — the committed manifest was already current, so no regen
  was owed and none was smuggled in.
- `test/structure-manifest.test.js` + `test/dual-home-parity.test.js` run individually: **14/14 pass,
  exit 0**, including *"A — the committed manifest is byte-exactly what the generator produces today"*.

## 8. `git status --porcelain` — PASS, every path attributed

**0267's own paths (7):** `claude/skills/fkit-task-brief/SKILL.md`,
`claude/skills/fkit-sprint-ship-loop/SKILL.md`, `ai-agents/sprints/backlog.md`, `README.md`, the
task's `brief.md` (driver's `🔄 In progress` mark + one href repair), plus untracked `plan.md` and
`worklog.md`.

**0266's shipped work, expected and NOT a scope violation (6):** `claude/skills/fkit-status/SKILL.md`,
the `RM` move of `0266`'s brief into `done/`, its untracked `plan.md`/`review.md`/`worklog.md`,
`ai-agents/sprints/sprint-5.md` (0266's row → `✅ Done (agent-closed)` + href, and 0267's row →
`🔄 In progress`), and the href repair in `0265`'s brief.

**Paths belonging to neither task: NONE.**

`git diff --stat`: 9 files, 79 insertions, 30 deletions. `0267`'s source surface is exactly the four
planned paths — no manifest, no scaffold, no `dashboard.sh`, no `structure-spec.md`, no test file.

## The Build worker's three flags — all three verified

1. **`backlog.md` historical rows shifted `:119,:122` → `:121,:124` — CONFIRMED, exactly.**
   HEAD's sweep of that file returned `:8, :119, :122`; the worktree returns `:121, :124`. The `:8`
   target hit is gone (Edit 5), the two historical rows moved +2 because Edit 5 added two lines. Row
   **content** is untouched. The plan's step-3 accounting table must be read with that +2 offset.

2. **Edit 6 adds a NEW `sprint-*.md` occurrence in `README.md:39` — CONFIRMED, and judged ACCEPTABLE,
   not a defect.** HEAD's `README.md` contained **zero** occurrences; the worktree contains **one**.
   Reasoning:
   - It is a **mention, not a use**. ADR-041 §6's criterion is *"states the glob as the mechanism."*
     This sentence asserts the opposite — that a downstream file's claim about the glob **is stale** —
     and the very next sentences give the identity-based rule. Deleting the token would leave a
     downstream reader unable to recognize the stale sentence in their own `backlog.md`, which is the
     note's entire purpose.
   - It is **the owner-approved Edit 6 text, verbatim**. Removing the token would be a deviation from
     an approved plan, decided by a Verify worker — exactly the judgment call I must not make alone.
   - `README.md` is **outside the brief's step-3 grep scope** (`claude/` + `ai-agents/sprints/`), so it
     does not affect that step's accounting either way.
   - ⚠️ **Residual, reported not fixed:** a future sweep widened to the whole repo will hit
     `README.md:39` and require the reader to apply the use/mention distinction. Worth a one-line
     note if such a sweep is ever automated. **Not filed.**

3. **Step 3's prediction flaw — CONFIRMED and, as reported above, worse than the Build worker stated**
   (the two-unreachable-zones problem is additional to the six surviving hits).

## Residuals carried forward from build, re-confirmed at verify

- `fkit-sprint-ship-loop` step 1 still has **no executable path** when `$ARGUMENTS` is empty — it now
  points at `fkit-status`'s rule, as ADR-041 §5 requires. Giving the loop its own
  `dashboard.sh select-active` call would be a **new step**, forbidden by this brief. **Not filed.**
- The eighth-site candidate — owner-ruled report-don't-edit; confirmed untouched.
- Brief verification step 1 (`0266` closed first): re-confirmed on disk — `0266`'s brief is at
  `ai-agents/tasks/done/…` (git `RM`) and `sprint-5.md:147` reads
  `✅ Done (agent-closed — not owner-verified)`. Closed **2026-08-12**, uncommitted.

**Nothing was committed or pushed. `ai-agents/wiki-vault/` was not written. `plan.md` was not
re-authored.**

---

# Review round 1 processed (2026-08-12) — separate spawn, `fkit-sprint-ship-loop` Process-review worker

Ledger: this folder's `review.md`. Findings R1, R2, R3 read from the *Reviewer findings* section
(never edited); verdicts and actions written into the *Coder response* section.

Ran under the sprint-loop declared-approval marker (ADR-032 Decision 3 + its autonomy amendment,
discipline per ADR-019): the owner approved this task's plan at the plan gate, and took **three
further rulings via `AskUserQuestion` in the driver session after the review**. No owner channel
existed in this spawn.

## Decision log — decisions taken without asking

1. **Applied R1's fix without asking.** Answers finding **R1** (medium, `ai-agents/sprints/backlog.md:8`).
   **What changed:** the clause *"never by its filename"* became *"with **no pattern on the
   filename**"* — one clause, one line, rewrapped to the file's ~100-col width. Nothing else in the
   paragraph touched.
   **Why it qualified:** (a) **verified `CORRECT` before editing** — `plan_sprint_from_stem()`
   (`dashboard.sh:109-119`) resolves an identity from the filename stem and is reached whenever the H1
   rung is silent (`:140-143`), and a `backlog` basename resolves `Backlog` at `:148`; the filename is
   therefore genuinely an identity source and the old clause was false. (b) **mechanical and
   localized** — a single prose clause in a file already in this task's approved diff. (c) **inside
   the approved plan** — Edit 5 is the plan's own edit to this exact sentence, and the replacement
   wording is 0266's landed phrasing at `fkit-status/SKILL.md:32`, which the plan names as its
   wording precedent. (d) **explicitly owner-ruled** — *"Fix R1 + R2, accept R3 (Recommended)"*.
   **Bounded deliberately:** the owner's ruling warned that the two adjacent claims are TRUE for this
   board. I re-verified that (this board's H1 resolves at the H1 rung, `dashboard.sh:99-100`) and left
   both untouched.

2. **Applied R2's fix without asking.** Answers finding **R2** (medium,
   `claude/skills/fkit-task-brief/SKILL.md:339`).
   **What changed:** the unconditional claim *"`/fkit-status` resolves a `sprint-backlog.md` to the
   identity `Backlog` too"* became a two-branch statement — H1 carries the token ⇒ identity `Backlog`,
   never eligible; H1 carries neither token ⇒ resolves to nothing, with `unresolved-plan-sprint` drift
   on every status run — prefixed by *"but the filename is not what decides that."* The ADR-041 §2
   link is retained (plan-gate ruling 4).
   **Why it qualified:** (a) **verified `CORRECT`** — for `sprint-backlog.md` the stem rung's regex
   `^(plan-)?sprint-([0-9]+[a-z]?)$` (`dashboard.sh:118`, `:68`) rejects a non-numeric stem and the
   basename case (`:148`) fires only for exactly `backlog`, so identity is EMPTY; ADR-041 states this
   case at `:151` and pins it as scenario **S8** at `:235`. (b) **mechanical and localized** — one
   sentence, one bullet, in a file already in the approved diff. (c) **inside the approved plan** —
   Edit 2 is the plan's own rewrite of this bullet, and this correction keeps its structure (rule
   sentence byte-identical, reason replaced). (d) **explicitly owner-ruled**, with the owner noting
   this ships to fresh projects via the generator.
   **Bounded deliberately:** R3's href sentence sits in the same bullet and was left byte-identical,
   because the owner ruled R3 accepted-as-is.

3. **No obvious-winner calls were made.** Every other judgment was owner-ruled in advance.

**Nothing else was edited.** No `fkit-status/SKILL.md`, no `dashboard.sh`, no
`priority-is-rank-not-identity.md`, no brief step-3 text, no manifest regen, no scaffold copy.

## Verification after the fixes

- **`npm test` — PASS, exit 0.** Full suite including the `prove-red.sh` hard gate: *"real +
  unmutated copy green; each mutation reds its NAMED assertion"* — all 15 mutations red their named
  assertion.
- **`git diff --stat` — this task's four paths only**: `README.md`, `ai-agents/sprints/backlog.md`,
  `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `claude/skills/fkit-task-brief/SKILL.md`. The other
  paths in the diff (`claude/skills/fkit-status/SKILL.md`, `ai-agents/sprints/sprint-5.md`, three
  `brief.md` files) are 0266's and the loop's separate uncommitted work — not touched by this spawn.

## Residuals recorded in `review.md` (owner-ruled, do-not-re-litigate)

- **AR1** — R3's href over-claim, accepted as-is (rhetorical; the rule stands on "one board, one file").
- **AR2** — `README.md:39`'s new `sprint-*.md` occurrence, accepted (use/mention; outside sweep scope).
- **AR3** — `fkit-sprint-ship-loop` step 1 has no executable path for an empty `$ARGUMENTS`, accepted
  as a **frontier-move**, with the owner ruling it be **filed as a new task later**.
  ⛔ **Not filed by this spawn** — the owner's verbatim label was *"File it as a new task later
  (Recommended)"*, and no mover was invoked. Carried into the driver's sprint roll-up.

**Nothing was committed or pushed. `ai-agents/wiki-vault/` was not written. `plan.md` was not
re-authored. No task file was moved.**

---

# RE-VERIFY spawn (2026-08-12) — post-fix, independent measurement

Spawned by `/fkit-sprint-ship-loop` after R1 and R2 were applied. **Verification only — nothing was
implemented, fixed or repaired in this spawn.** Every claim below was measured against the real
`claude/skills/fkit-status/dashboard.sh`, not read off `worklog.md` or `review.md`.

| # | Check | Verdict |
|---|-------|---------|
| 1 | `npm test` full suite | **PASS** — exit 0, 709/709, hard gate green |
| 2a | R1 — `backlog.md:7-10` "no pattern on the filename" true, and agrees with 0266 | **PASS** (one citation nit) |
| 2b | R2 — H1 carries `Backlog`/`Sprint Backlog` → identity `Backlog` | **PASS** |
| 2c | R2 — H1 carries neither → resolves to nothing | **PASS** |
| 2d | R2 — `unresolved-plan-sprint` drift fires "on **every** status run" | **FAIL — measured 0 on a status run** |
| 3 | Rule's first sentence + R3's sentence byte-identical to baseline | **PASS** |
| 4 | The two adjacent claims present and true | **PASS** |
| 5 | ADR-041 relative links resolve | **PASS** |
| 6 | `priority-is-rank-not-identity.md` untouched, both homes identical | **PASS** |
| 7 | `git status --porcelain` attribution | **PASS** — every path belongs to 0266 or 0267 |

## 1. `npm test` — PASS, exit 0

Captured with `npm test > log 2>&1; echo "NPM_TEST_EXIT=$?"` (no pipe, so no zsh/`PIPESTATUS` trap):

```
NPM_TEST_EXIT=0
ℹ tests 709
ℹ suites 17
ℹ pass 709
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 59365.3915
...
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

All 15 `prove-red.sh` mutations red their named assertion; all 9 baselines (0a–0i) green.

## 2a. R1 — PASS on substance; one citation nit

`ai-agents/sprints/backlog.md:7-10` as written:

> **⚠️ The filename is deliberately `backlog.md`, NOT `sprint-backlog.md`.** `/fkit-status` resolves the
> active sprint by each plan's **identity**, with **no pattern on the filename**: this board's identity
> is `Backlog`, which is **never eligible**, so the default status run ignores it no matter what the
> file is called

0266's landed wording, quoted for comparison — **`claude/skills/fkit-status/SKILL.md:32`**:

> It considers every `.md` **directly** in `ai-agents/sprints/` — **no pattern on the filename** —
> and resolves each one's identity for you.

**True by measurement.** `mode_select_active()` (`dashboard.sh:237-243`) iterates `for _f in "$1"/*.md`
— every `.md` at depth 1, no `sprint-*` pattern anywhere in the candidate set. The phrase is
byte-identical between the two files.

⚠️ **Citation nit (not a defect in the shipped prose):** `review.md:13` and `:37` both cite 0266's
wording as `fkit-status/SKILL.md:29-30`. It is actually at **`:32`** (`:29-30` is the fenced
`bash … select-active` command). The ledger's *line reference* is off by three; its *claim* is correct.

## 2b/2c. R2's first two claims — PASS

Fixtures built in the session scratchpad (`/private/tmp/.../scratchpad/fix/`), **never in the repo and
never under `ai-agents/`**. Each is a `sprint-backlog.md` differing only in its H1:

```
### CLAIM 1a: H1 carries 'Sprint Backlog'
Backlog
  exit=0
### CLAIM 1b: H1 carries 'Backlog'
Backlog
  exit=0
### CLAIM 2: H1 carries neither  (H1 = '# Unscheduled work')
  stdout=[]  exit=3
```

Both claims hold exactly as `SKILL.md:339-341` states them.

## 2d. R2's third claim — **FAIL as written**

`claude/skills/fkit-task-brief/SKILL.md:341-343` claims:

> If the H1 carries neither token, it resolves to **nothing at all** … and that board then reports
> `unresolved-plan-sprint` drift on **every** status run

**Measured: `unresolved-plan-sprint` does not fire on a status run at all.** It is emitted only in
**board mode** (`dashboard.sh:1151-1153`), i.e. only when `dashboard.sh` is handed that file as the
plan to render. Two measurements:

**(i) A `sprints/` holding a real active sprint plus the stray board** — the default run renders the
chosen board, not the stray one:

```
### DEFAULT STATUS RUN, step 1 — select-active over a dir holding BOTH
active file="sprint-5.md" identity="Sprint 5"
candidate file="sprint-5.md" identity="Sprint 5"
candidate file="sprint-backlog.md" identity="unresolved"
  exit=0
### DEFAULT STATUS RUN, step 2 — board render of the CHOSEN file (sprint-5.md)
  unresolved-plan-sprint drift lines in the default run = 0
```

**(ii) The scenario the sentence actually warns about — a project whose only board is that file:**

```
active none
candidate file="sprint-backlog.md" identity="unresolved"
  exit=3
```

`fkit-status/SKILL.md:47-48` on `active none`: *"say so, list every `candidate` line with its identity
or `unresolved`, and stop."* **No board is rendered, so board mode never runs and the drift token is
never emitted.**

The stray board **is** surfaced on every default run — as `candidate file="…" identity="unresolved"`,
which `SKILL.md:42-43` requires the briefing to report. So there is a real per-run cost; the sentence
names the **wrong mechanism** for it. Board-mode rendering of that file does emit the drift, three runs
confirming determinism (count = 1 each), with the `Backlog`-H1 control at count = 0.

⚠️ **The imprecision is inherited, not invented by this task.** ADR-041 itself says it, at `:150-153`:
*"resolves EMPTY … but it **loses** the `:796` check and reports `unresolved-plan-sprint` on every
run."* The fix faithfully echoed an accepted ADR. **Reported, not repaired** — the remedy is a
judgment call and is returned to the driver as `NEEDS-DECISION`.

## 3. Byte-identity — PASS (proved by `cmp`, not asserted)

**The rule's first sentence, HEAD vs worktree:**

```
HEAD     334:- **⚠️ Never file against `backlog.md` by writing a `sprint-backlog.md`.** `/fkit-status` finds the
WORKTREE 336:- **⚠️ Never file against `backlog.md` by writing a `sprint-backlog.md`.** There is **one** backlog
```

Sentence bytes extracted through the closing `.**` and compared: **`cmp` reports no difference.** The
sentence survives the whole task unchanged; only the reason after it was replaced.

**R3's sentence.** ⚠️ **The re-verify brief's premise needed correcting:** R3's sentence is **not** at
HEAD — `git show HEAD:… | grep -c "href in the repo"` returns **0**. It is *new text this task added*
at the build step. The meaningful baseline is therefore the approved plan's Edit 2 replacement block
(`plan.md:132-134`), which the owner approved. Compared against worktree `SKILL.md:336-338`: **`cmp`
reports no difference.** The R2 fix left R3's sentence byte-identical, as `review.md:38` claims.

## 4. The two adjacent claims — PASS, present and true

Both present (whitespace-normalized — each wraps across a line break, so a line-based grep misses them):

```
  PRESENT: "ignores it no matter what the file is called"
  PRESENT: "renaming this file could not make it the active sprint"
```

**True by measurement.** The real `ai-agents/sprints/backlog.md` content was copied into scratch
fixtures under five different filenames and resolved:

```
  backlog.md       -> identity=[Backlog]   select-active: active none
  sprint-backlog.md -> identity=[Backlog]  select-active: active none
  sprint-99.md     -> identity=[Backlog]   select-active: active none
  plan-sprint-7.md -> identity=[Backlog]   select-active: active none
  zzz-anything.md  -> identity=[Backlog]   select-active: active none
```

Its H1 is `# Backlog — the default home for unsprinted task briefs`, so it resolves at rung 1 and no
filename rung is ever reached. Renaming it into any name — including a numeric sprint stem — cannot
make it the active sprint.

## 5. ADR-041 links — PASS

Every ADR-041 link in the edited files resolves from its own directory:

```
  OK   claude/skills/fkit-task-brief/SKILL.md -> ../../../ai-agents/knowledge-base/decisions/adr-041-…md
  OK   ai-agents/sprints/backlog.md -> ../knowledge-base/decisions/adr-041-…md
  OK   README.md -> ai-agents/knowledge-base/decisions/adr-041-…md (root-relative)
```

`claude/skills/fkit-sprint-ship-loop/SKILL.md` carries **no** ADR-041 href — its edit cites
`fkit-status/SKILL.md`'s rule in the file's own house style, as planned.

## 6. `priority-is-rank-not-identity.md` — PASS

`git diff --stat HEAD --` on both paths: **empty** (untouched vs HEAD). `cmp` between the two homes:
no difference. Identical SHA-1 in both homes:

```
22db032c1bc748fbbd85e62ab8f9e4c16f3c9b80  ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md
22db032c1bc748fbbd85e62ab8f9e4c16f3c9b80  claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md
```

## 7. `git status --porcelain` — PASS, every path attributed

```
 M README.md                                                    <- 0267 (Edit 6)
 M ai-agents/sprints/backlog.md                                  <- 0267 (Edit 5 + R1 fix)
 M ai-agents/sprints/sprint-5.md                                 <- 0266 close + 0267 In-progress row
 M ai-agents/tasks/backlog/0267-…/brief.md                       <- 0267 (Status -> 🔄 In progress; 0266 href repointed to done/)
 M ai-agents/tasks/done/0265-…/brief.md                          <- 0266 (href repair, ../../backlog/0266 -> ../0266)
RM ai-agents/tasks/backlog/0266-…/brief.md -> done/0266-…/brief.md  <- 0266 close
 M claude/skills/fkit-sprint-ship-loop/SKILL.md                  <- 0267 (Edits 3+4)
 M claude/skills/fkit-status/SKILL.md                            <- 0266
 M claude/skills/fkit-task-brief/SKILL.md                        <- 0267 (Edits 1+2 + R2 fix)
?? …/0267-…/{plan,review,worklog}.md                             <- 0267 artifacts
?? …/done/0266-…/{plan,review,worklog}.md                        <- 0266 artifacts
```

**No path belongs to neither task.** The two that are not obviously 0267's were both inspected:
`sprint-5.md` carries only the 0266 `✅ Done` row flip and the 0267 `🔄 In progress` flip; the 0265
brief change is a **one-line href repair** consequent to 0266's folder move
(`../../backlog/0266-…` → `../0266-…`), with no prose change.

**Nothing was committed or pushed. `ai-agents/wiki-vault/` was not written. `plan.md` was not
re-authored. No file outside this `worklog.md` was modified by this spawn. All fixtures were built in
the session scratchpad, outside the repo.**

---

# Ledger recording spawn (2026-08-12) — `fkit-sprint-ship-loop` recording worker

**Recording only. No source file was touched.** Bounded unit: write the owner's AR4 ruling into
`review.md`, mirror it here, and repair two recording errors the re-verify pass surfaced.

## Decision log — decisions taken without asking

1. **Recorded AR4 in `review.md` without asking.** Answers the **re-verify pass's `NEEDS-DECISION`**
   on `claude/skills/fkit-task-brief/SKILL.md:341-343`.
   **What changed:** a fourth entry (**AR4**) in `review.md`'s *Accepted residuals* section, in the
   same What / Why / Re-raise-only-if shape as AR1–AR3; the section preamble "All three below" →
   "All four below"; the R2 row's Status → `fixed, with AR4 residual` with a pointer to AR4; and a
   ⚠️ correction paragraph appended to the R2 verification bullet so the ledger no longer leaves the
   wrong mechanism standing unqualified.
   **Why it qualified:** **not an autonomy call at all — an owner ruling transcribed.** The owner
   ruled it live via `AskUserQuestion` in the driver session; verbatim label *"Accept as residual,
   file follow-up (Recommended)"*. Writing an approved ruling into the section this role owns is the
   recording act itself.
   **Bounded deliberately:** the *Reviewer findings* section was not touched; **no follow-up task was
   filed, no brief written, no mover invoked** — the owner ruled it filed later.

2. **Corrected the `fkit-status/SKILL.md:29-30` → `:32` citation, in coder-owned text only.**
   Answers re-verify §2a's citation nit.
   **What changed:** `review.md`'s R1 response row (Coder response section) and this worklog's
   Process-review decision log entry 1. `:29-30` is the fenced `bash … select-active` command; the
   *"no pattern on the filename"* wording is at **`:32`** — verified this spawn by
   `grep -n` on `claude/skills/fkit-status/SKILL.md`.
   **Why it qualified:** verified `CORRECT` against the file, mechanical, and confined to sections
   this role owns.
   ⚠️ **NOT corrected — `review.md:13`, the R1 finding row, carries the same `:29-30` citation.**
   That is the **reviewer's own** *Reviewer findings* section and this role never edits it.
   **Flagged for the reviewer:** claim correct, line reference off by three.

3. **Corrected an unprovable byte-identity premise, in coder-owned text.** Answers re-verify §3.
   **What changed:** `review.md`'s *Wording landed* preamble said the rule's first sentence and R3's
   href sentence were "byte-identical to before" — one vague baseline for two different ones, reading
   as *to HEAD* for both. Now stated separately: the **first sentence** is byte-identical **to HEAD**
   (it predates this task); **R3's href sentence is new text this task added at the build step and has
   no HEAD counterpart** (`git show HEAD:… | grep -c "href in the repo"` → `0`, measured at re-verify),
   so its provable baseline is the **approved plan's Edit 2 replacement block** (`plan.md:132-134`),
   against which the R2 fix left it byte-identical (`cmp`, no difference).
   **Why it qualified:** the correction replaces an unprovable claim with the measured one; mechanical
   and confined to this role's section.

4. **No obvious-winner calls were made.** Nothing else was decided in this spawn.

## Residual now recorded (owner-ruled, do-not-re-litigate)

- **AR4** — `fkit-task-brief/SKILL.md:341-343` (text added by R2's own fix) names
  `unresolved-plan-sprint` drift as the stray board's per-run cost. **Measured 0 drift lines on a
  status run** in both scenarios; the token is emitted only in **board mode**
  (`dashboard.sh:1151-1153`). The per-run cost is real but surfaces as a
  `candidate file="…" identity="unresolved"` line (`fkit-status/SKILL.md:42-43`). **Inherited from
  accepted ADR-041 `:150-153`, not invented here.** Accepted because 0267's own goal (delete every
  `filename ⇒ identity` claim) is fully met, and fixing the skill alone would leave it contradicting
  the ADR it cites; the owner ruled a **follow-up task correct ADR-041 and its echoes together**.
  ⛔ **Not filed by this spawn.** Carried to the driver.

**Nothing was committed or pushed. `ai-agents/wiki-vault/` was not written. `plan.md` was not
re-authored. No task file was moved. No source file was modified — the only files this spawn wrote are
this folder's `review.md` and `worklog.md`.**
