# Review — 0132-reconcile-dual-homed-file-drift-live-vs-scaffold

Task: 0132 — [brief](./brief.md)
File(s) under review:
- `test/dual-home-parity-exceptions.mjs` (new — the deliverable)
- `claude/scaffold/ai-agents/knowledge-base/conventions/dependency-declaration-form.md` (new, generalized)
- `ai-agents/knowledge-base/conventions/dual-home-parity.md` (modified)
- `ai-agents/knowledge-base/conventions/README.md` (modified)
- `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` (modified)
- `ai-agents/tasks/backlog/0132-.../plan.md`, `worklog.md` (new)

Status: in-review

**Verdict (Round 1): ⚠️ Changes requested — 6 defects (none blocking).**
Reviewers run: reviewer's own pass **+ Codex adversarial pass (`codex-cli 0.145.0`, read-only) — RAN, full
coverage. No degradation.** R1 and R2 were raised independently by both reviewers.

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `test/dual-home-parity-exceptions.mjs:178-235` | The 10 `project-content-dir` entries match **bidirectionally**, so any real dual-homed file later added *under* one silently escapes 0133's byte-parity enforcement. Concrete named case: `ai-agents/knowledge-base/reports/README.md` — an undated folder-purpose doc of the same species as `tasks/README.md`, which **is** dual-homed and enforced — is parked under `knowledge-base/reports/` and would stay unenforced if ever shipped. Mechanism is already live: 9 `.gitkeep` files exist in **both** homes under such entries today. *(Raised by both reviewers.)* |
| R2 | 1 | low | `ai-agents/knowledge-base/conventions/dual-home-parity.md:46-58` | The table declared a human-readable **MIRROR** of the module omits 5 of the module's 26 entries — all `runtime-state`: `.fkit/`, `tasks/backlog/.fkit`, `wiki-vault/.fkit`, `wiki-vault/.wiki-watermark`, `knowledge-base/.gitkeep`. *(Raised by both reviewers.)* |
| R3 | 1 | low | `test/dual-home-parity-exceptions.mjs:282-289` | `findException()` does not normalize `..` segments, so a traversal path can masquerade as a directory exception: `findException('knowledge-base/reports/../conventions/task-owner-vocabulary.md')` returns the `knowledge-base/reports/` entry, though the normalized target is byte-enforced. **Not reachable from `diff -rq` output** (which emits no `..`), so this is a contract gap, not a live bug. |
| R4 | 1 | low | `test/dual-home-parity-exceptions.mjs:245-249` | The `tasks/backlog/.fkit` entry is **dead**: the earlier `tasks/backlog/` directory entry always wins `Array.find`, so this entry's specific `runtime-state` reason is unreachable. Confirmed by instrumenting a full classifier run — it matched 0 of 456 diff lines. |
| R5 | 1 | low | `ai-agents/tasks/backlog/0132-.../worklog.md:47` | The worklog's "What changed" table states the module has **25 entries**; it has **26** (16 file + 10 directory). A factual slip in the task's own evidence record. |
| R6 | 1 | low | `claude/scaffold/ai-agents/knowledge-base/conventions/dependency-declaration-form.md:18-21` | The shipped "examples that parse" block mixes ID forms — `0042`/`0043` (canonical 4-digit folder ID) alongside `task 17` (legacy 2-digit) — in a scaffold that also ships `priority-is-rank-not-identity.md` ("a task's identity is its folder-name ID"). Teaches a consuming project two ID forms in four lines. |

## Coder response

_(coder-owned — do not write above this line into this section)_

**Round 1 response, 2026-08-01.** All six findings independently verified against the code before any
change. **All six are CORRECT — none was wrong, none was partially correct, none is a frontier-move.**
Owner ruled: fix R2–R6 now, hand R1 to task 0133.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | ✅ CORRECT (verified) | **defect — latent** | **NOT fixed here. Handed to task 0133** per owner ruling (0133 owns the test, so it owns the fix). Recorded in three places — see below. | **deferred → 0133** |
| R2 | ✅ CORRECT (verified) | defect | Added the 5 missing `runtime-state` rows to the mirror table in `dual-home-parity.md`; mirror now carries all 26 entries and states a keep-in-step rule. | **fixed** |
| R3 | ✅ CORRECT (verified) | defect — contract gap, not reachable from `diff -rq` | `findException()` now normalizes `.`, `..` and empty segments; a path climbing above the home root gets no exception. | **fixed** |
| R4 | ✅ CORRECT (verified) | defect — dead entry | **Made live, not removed** — `findException()` resolves an exact entry before a covering directory entry. Rationale below. | **fixed** |
| R5 | ✅ CORRECT (verified) | defect — factual error in the evidence record | Worklog `25` → `26 (16 file + 10 directory)`. **A second stale count found and fixed**: the `Only in` census. | **fixed** |
| R6 | ✅ CORRECT (verified) | defect — internal inconsistency in a shipped artifact | Scaffold `dependency-declaration-form.md`: `task 17` → `task 0044`. Every example ID is now the canonical 4-digit form. | **fixed** |

### Verification of each claim, before acting

- **R1 — confirmed, with one correction to the finding's wording.** Directory entries do match
  bidirectionally, and the 9 `.gitkeep` files in both homes are real (verified by walking both trees:
  `sprints/`, `sprints/done/`, `tasks/{backlog,done,cancelled}/`,
  `wiki-vault/wiki/{tasks,features,decisions,systems}/`). `knowledge-base/reports/README.md` exists live
  with no scaffold counterpart, confirmed. **Correction:** the finding says *"the 10 `project-content-dir`
  entries"*; there are **9** `project-content-dir` entries plus **1** `runtime-state` directory entry
  (`.fkit/`) = 10 **directory** entries. The substance is unaffected — the softness belongs to every
  directory entry, whatever its `kind`.
- **R2 — confirmed exactly.** Counted the mirror table against the module: 21 of 26 entries present, the
  5 absent ones are precisely the `runtime-state` set the finding names.
- **R3 — confirmed, and the reviewer's own limit confirmed with it.**
  `findException('knowledge-base/reports/../conventions/task-owner-vocabulary.md')` returned the
  `knowledge-base/reports/` entry. Also confirmed **not reachable from `diff -rq`**: all 456 lines were
  re-parsed and none contains a `..` segment. Fixed anyway — it is the **unsafe** direction (a silent
  false exception on a byte-enforced file), and closing it in the matcher is cheaper than trusting every
  future caller to normalize first.
- **R4 — confirmed by instrumented run, matching the reviewer's method.** Pre-fix classifier over all
  456 lines: `tasks/backlog/.fkit` matched **0**, `tasks/backlog/` matched **47**.
- **R5 — confirmed, plus a second stale count the finding did not name.** Module has 26; worklog said 25.
  Sweeping for others found the `Only in` census also wrong: it read *"~430 … ADRs (35), reports (24)"*
  against an actual 440 / 36 / 25. Both corrected. Other counts checked and found **right**: "Seven
  conventions ship with the scaffold" (scaffold holds 7 + README, counted), "Live lists 8 conventions"
  (live holds 8 + README, counted), 551/17 test figures (reproduced).
- **R6 — confirmed.** Scaffold ships both `dependency-declaration-form.md` (mixed `0042`/`0043` +
  `task 17`) and `priority-is-rank-not-identity.md`, whose line 3 makes the folder-name `NNNN` prefix a
  task's identity. The two contradict each other inside one shipped scaffold.

### R4 — why "make it live" rather than "remove it"

The owner authorized either. **Made live.** Removing it leaves the line
`Only in ai-agents/tasks/backlog: .fkit` matching `tasks/backlog/`, whose reason is *"the live tree holds
fkit's own task folders"* — **the wrong reason for a generated launcher file**. This brief's thesis is
*"record the reason, not just the path"*, so an entry excused under a wrong reason is precisely the
failure mode the task exists to stop. Making it live also fixes the **class**: exact-beats-directory is
order-independent, so no future re-sort of the array can silently kill an exact entry again — whereas
reordering the array would have fixed this one case and left the trap armed.

**Scope check, since the fix touches the matcher rather than the data:** the rule changes the result for
**exactly one** path. Verified by re-running the full classifier — `tasks/backlog/.fkit` 0 → 1,
`tasks/backlog/` 47 → 46, **every other entry unchanged**, and the derived enforced set still the same
four files.

### R6 — resolved together with the cleared `task 17` finding

The reviewer cleared `task 17` as **illustrative syntax** (the parser's own doc at `dashboard.sh:287`
uses `**Depends on: task 18**` as its bold-inline example) and separately flagged the **mixed** ID forms
as R6. **Both hold, and one change serves both.** The example's job is to show (a) the bold-inline shape
— the closing `**` mid-line with trailing prose — and (b) that a `task N` prefix parses. Changing only
the **digits** preserves both and removes the contradiction.

**Proven, not assumed.** The parser anchor is `/\*\*Depends on[.: ]/` (`dashboard.sh:401`), the value is
lifted by `substr()` (`:403`), and `dashboard.sh:263` states it is **"NEVER interpreted"** — digit-count
cannot reach the parse. Ran both lines through the anchor: `task 17` and `task 0044` both take the
identical `BOLD-INLINE MATCH` branch. The illustration is not blunted.

### R1 — the hand-off to task 0133 (outstanding, not closed)

**Not fixed in 0132.** Owner ruling 2026-08-01 took the reviewer's own recommendation: 0133 owns the
test, so it owns the fix, and the gap is latent.

> **The assertion 0133 must add: no directory exception may cover a non-`.gitkeep` file that is present
> in BOTH homes.**

Such a file is dual-homed by construction and belongs on the enforced set, not under a blanket. The
`.gitkeep` carve-out is **required**, not cosmetic — 9 of them sit in both homes today and would
otherwise fire the assertion immediately. Named near-miss: `knowledge-base/reports/README.md`, same
species as the enforced `tasks/README.md`.

Recorded in **three** durable places so 0133 cannot miss it:
1. this ledger section;
2. `ai-agents/tasks/backlog/0132-…/worklog.md` → *"⚠️ HAND-OFF TO TASK 0133"* + follow-up 2;
3. `test/dual-home-parity-exceptions.mjs` → a comment on the `project-content-dir` block, which is the
   file 0133 imports and therefore the one its author will have open.

**0133's brief was deliberately NOT edited** — that is the producer's file.

### Re-verification after the fixes

| Check | Result |
|---|---|
| Full classifier over every `diff -rq` line | **456 lines, 456 matched, 0 unmatched** |
| Dead entries remaining | **none** (`tasks/backlog/.fkit` 0 → 1; `tasks/backlog/` 47 → 46; no line orphaned) |
| R3 traversal probe | `knowledge-base/reports/../conventions/task-owner-vocabulary.md` → `undefined` (byte-enforced), was `knowledge-base/reports/` |
| Derived enforced set | unchanged — the same four files |
| `node --test test/*.test.js` | **551 pass / 0 fail / 0 skipped / 17 suites** |
| `bash test/prove-red.sh` | **hard gate PASSED** |
| Existing test files modified | **none** — `git status -- test/` shows only the new untracked `.mjs` |
| Verification step 3 (regression guard) | `dual-home-parity.md` still **ABSENT** from the scaffold (`find claude/scaffold -name 'dual-home-parity*'` → empty) |
| Verification step 2 | **still SUPERSEDED by owner ruling, NOT met** — unchanged by this round |

### Outstanding after this round

1. **R1 → task 0133.** The only finding not fixed. Not a defect left in the code; a required assertion
   handed to the next task.
2. **Brief verification step 2 remains superseded, not met** (settled residual, not re-litigated here).
3. **New, found while fixing R6 and not fixed:** the **live** `dependency-declaration-form.md` has the
   same mixed-ID-form issue in its examples (`0110`/`0112` alongside `task 36`), and the live tree also
   ships `priority-is-rank-not-identity.md`. **Deliberately not touched** — R6 is scoped to the scaffold
   file and the approved plan leaves the live copy unchanged; fixing it would widen this round beyond the
   five approved fixes. Raised here rather than acted on. → **Now CLOSED — see the round-3 note below.**

### Round 3, 2026-08-01 — owner-approved widening (outstanding item 3, now fixed)

**Authorized scope change, not drift.** Item 3 above was raised and deliberately declined as out of
scope. The owner was asked and **approved widening the round** to fix the live copy (ruling 2026-08-01,
relayed through the `fkit-sprint-ship-loop` driver session). The widening covers **one thing only**:
ID-form consistency in the live `dependency-declaration-form.md` examples.

**Change:** `ai-agents/knowledge-base/conventions/dependency-declaration-form.md:16` —
`- **Depends on: task 36**` → `- **Depends on: task 0072**`. Same task, named by its permanent folder ID:
legacy task 36 *is* `0072-remove-fkit-omnigent-orphan-residue`. All three examples are now the canonical
4-digit form, matching `priority-is-rank-not-identity.md`, which this same live tree ships.

**Not changed, on purpose:** the verbatim `0092`-brief quote at `:29`, the deliberate dual form
"task 84 / `0092`" at `:26`, and the already-canonical `0020`/`0107` references.

**Proven through the real parser, not the anchor alone.** `depends_raw()` lifted from
`claude/skills/fkit-status/dashboard.sh:314-449` and run on synthetic briefs: old and new both return
form **`BI`** with values `task 36` / `task 0072`, the identical bold-inline branch, trailing prose cut by
BI's `**` terminator. Both jobs of the example survive — the bold-inline shape, and that a `task N`
prefix parses.

**The two copies were NOT re-synced** — they are deliberately divergent per the accepted residual below.
Classifier re-run: **456 diff lines, 456 matched, 0 unmatched, 0 dead entries**, and this file still
reports as `Files … differ` → `audience-adapted`, exactly as expected. `node --test test/*.test.js` →
**551 pass / 0 fail / 17 suites**; `bash test/prove-red.sh` → **hard gate PASSED**.

**Exception-module reason text: checked, and correctly left unedited.** Its four cited specifics — the
task-84 / `0092` narration, the `0020` R19/R40 prior art, the "The guard (task 0107)" section, and what
the scaffold copy drops — are all in text this edit does not touch. **Nothing in the reason is
invalidated**, so `test/dual-home-parity-exceptions.mjs` is unchanged.

## Accepted residuals (shared, do-not-re-litigate)

- **Audience-adapted is a legitimate third kind** — What: five live/scaffold conventions plus
  `ai-agents/README.md` stay deliberately divergent; byte-parity is enforced only on the genuinely
  identical set. · Why (structural): owner ruling 2026-08-01 on this task's own evidence; byte-aligning
  live → scaffold was rejected as a **product regression** — it would ship fkit's incident narratives and
  unresolvable relative links into `tasks/`/`sprints/` to every consuming project. · Re-raise only if: a
  specific file's divergence can be shown to be plain staleness rather than audience adaptation.
- **`dependency-declaration-form.md` ships generalized** — What: the scaffold copy is a de-fkit-ified
  rewrite, not a byte copy. · Why (structural): owner ruling 2026-08-01; brief verification step 2
  ("byte-identical") is **superseded, not met**, and the module records this in-place at
  `test/dual-home-parity-exceptions.mjs:160-171` so no future maintainer "fixes" it by copying the live
  file over. · Re-raise only if: the generalized copy is shown to have lost or corrupted normative
  content (reviewer checked it against `claude/skills/fkit-status/dashboard.sh` this round — it has not).
- **The exception list is a plain `.mjs` module** — What: `test/dual-home-parity-exceptions.mjs`
  exporting `{ path, kind, reason }`, with a human mirror in `conventions/dual-home-parity.md` naming the
  module authoritative. · Why (structural): owner ruling 2026-08-01; 0133 imports it rather than
  restating the list. · Re-raise only if: 0133 is shown unable to consume the shape.

## Re-litigates settled decisions (suppressed)

**None this round.** Neither reviewer re-raised byte-alignment, verification step 2, or the module
format. Recorded so a later round can see the suppression list was genuinely empty, not skipped.

## Verified-and-cleared (not defects — recorded so they are not re-chased)

- **The classifier claim holds, and not by an over-broad entry.** Reviewer re-ran a full classification of
  every line of raw `diff -rq` output against `findException()`: **456/456 matched, 0 unmatched.** The 10
  `Files … differ` lines and every file-level `Only in` line map to **specific file entries**; the
  directory entries absorb only fkit's own project content (440 lines: 180 wiki, 128 `tasks/done`, 47
  `tasks/backlog`, 36 ADRs, 25 reports, 11 cancelled, 6 history, 4 sprints, 3 incidents).
- **The enforced set is derivable, not hard-coded.** Walking the scaffold and subtracting exceptions
  yields exactly the four claimed files: `conventions/priority-is-rank-not-identity.md`,
  `conventions/task-owner-vocabulary.md`, `tasks/README.md`, `wiki-vault/schema.md`. The module exports
  both a named `exceptions` and a consistent `default`, so 0133's planned import/assert/subtract works.
- **The `task 17` disclosure is sound.** It is illustrative syntax, not leaked provenance: the parser's
  own documentation at `claude/skills/fkit-status/dashboard.sh:287` uses `**Depends on: task 18**` as its
  canonical bold-inline example. The coder disclosed it rather than hiding it. (R6 is a separate,
  narrower point about ID-form consistency.)
- **The generalized scaffold copy preserves the normative content.** Checked line by line against
  `claude/skills/fkit-status/dashboard.sh:399,401,410,446`: the canonical bold form, the two legacy
  equivalents (`## Depends on` section; line-start plain `Depends on:`), the optional-colon-when-bold
  rule, the `nothing` value, the absent-line → `ready` rule, and the `UNPARSEABLE` + `drift
  depends-unparseable` guard with its Latin-letter-blocked scoping are all intact and accurate.
- **The fixed check command is not blind and is runnable as written.** `diff -rq ai-agents
  claude/scaffold/ai-agents` (no `grep -v`) run verbatim emits 456 lines including `Only in ai-agents:
  …`, the line shape the old command filtered away.
- **The stale `reviews/README.md` row is correctly fixed.** `git show 331f298` confirms
  `R057 ai-agents/reviews/README.md → ai-agents/tasks/README.md`. A repo-wide grep finds no test, script,
  or convention still asserting on it — remaining hits are historical ADRs/reports, correctly untouched.
- **Both README indexes are correct.** The scaffold conventions directory holds exactly 7 conventions
  (counted), so "Seven conventions ship with the scaffold" is right. The live `†` footnote's previous
  claim ("Every other convention … must stay byte-identical") was false; its replacement — two
  byte-identical, the rest audience-adapted — matches the derived enforced set exactly.
- **Verification step 3 confirmed directly.** No `dual-home-parity.md` anywhere under `claude/scaffold/`.
- **No test weakened.** `git status`/`git diff` over `test/` show only the new untracked `.mjs`; no
  existing test file modified. Reviewer independently ran `node --test test/*.test.js` → **551 pass / 0
  fail / 17 suites**, and `bash test/prove-red.sh` → **hard gate PASSED**.

## Per-step verdict on the brief's six verification steps

| Step | Verdict | Evidence |
|---|---|---|
| 1 — fresh `diff -r` reports only exception-list paths | ✅ **met** | Re-derived independently: 456/456 diff lines map to an entry. |
| 2 — scaffold copy byte-identical to live | ⚠️ **SUPERSEDED, not met** | Owner ruling 2026-08-01. **The coder reported it exactly that way** — the worklog leads with "the brief's verification step 2 is NOT met" and the module records it at lines 168-170. No claim of satisfaction. Honest. |
| 3 — `dual-home-parity.md` still absent from scaffold | ✅ **met** | Directory listing + `find` — absent. |
| 4 — exception list exists, reason per entry, 0133-readable | ✅ **met** | 26 entries, all reasons non-empty and file-specific; no duplicate paths. R1 qualifies the *coverage* of the directory entries, not their presence. |
| 5 — both `conventions/README.md` accurate for their home | ✅ **met** | Counted directories; live `†` footnote corrected and now true. |
| 6 — existing suite green | ✅ **met** | 551/551, 17 suites, prove-red PASSED — reproduced by the reviewer, not taken on report. |

## Convergence call

**Round 1 — act, do not close out.** All six findings are novel; none re-litigates a settled residual.
Five are low-severity polish on documents. **R1 is the one substantive item** and is the design question
the task turns on: the exception module's directory entries make 0133's future coverage soft in a way its
per-file entries do not. It is **latent, not a present failure** — no real dual-homed file is hidden
today. It is cheaply closable (e.g. 0133 asserting that no directory exception covers a non-`.gitkeep`
file present in *both* homes, turning the blanket into a tripwire), but whether that belongs in 0132 or
0133 is a scoping call, not a defect verdict.

Nothing here blocks 0132 from shipping on the owner's rulings.
