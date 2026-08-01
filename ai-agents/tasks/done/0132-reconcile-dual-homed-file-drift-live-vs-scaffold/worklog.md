# Worklog — 0132 Reconcile the dual-homed file drift

**Built 2026-08-01** by `fkit-coder`, spawned as the Build worker of `/fkit-sprint-ship-loop` under the
declared-approval marker (owner approved the plan live in the `fkit-lead` driver session). No commit.

---

## ⚠️ Read this first — the brief's verification step 2 is NOT met

The brief demands:

> 2. `claude/scaffold/ai-agents/knowledge-base/conventions/dependency-declaration-form.md` exists and is
>    **byte-identical** to the live copy.

**It is not byte-identical, deliberately.** Owner ruling 2 (below) directs that the file ship as a
GENERALIZED copy, de-fkit-ified the way the other six scaffold conventions already are. The ruling
**overrides** the brief's bar; step 2 is **superseded, not satisfied**. This is recorded loudly here so
nobody later reads a green diff as evidence the brief was met on its own terms, and so nobody "fixes"
the divergence by copying the live file over the scaffold one.

All other verification steps (1, 3, 4, 5, 6) are met — evidence below.

---

## Owner decisions (2026-08-01, all signed in the driver session)

**Ruling 1 — Option B: recognize "audience-adapted" as a third kind.**
The convention's litmus has two kinds (fkit-authored ✅ must-match / project-specific ⛔ never-sync);
the sweep found three. Five files are the *same document* deliberately rewritten in the scaffold for a
consuming reader. They go on the exception list **with recorded reasons**; byte-parity stays enforced on
the genuinely-identical set. **Option A (byte-align live → scaffold) was rejected as a product
regression** on this task's own evidence: it would ship fkit's incident narratives and four broken
relative links into `tasks/`/`sprints/` to every consuming project.

**Ruling 2 — `dependency-declaration-form.md` ships GENERALIZED, not byte-identical.** See the warning
above.

**Ruling 3 — the exception list is `test/dual-home-parity-exceptions.mjs`**, a plain ES module exporting
an array of `{ path, kind, reason }`, with a human-readable mirror table in
`conventions/dual-home-parity.md` pointing at the module as authoritative.

---

## What changed

| File | Change |
|---|---|
| `test/dual-home-parity-exceptions.mjs` | **NEW — the deliverable.** **26 entries** (16 file + 10 directory), one per path, each with its own specific reason. Exports `exceptions` (array + default) and `findException(path)`. |
| `claude/scaffold/ai-agents/knowledge-base/conventions/dependency-declaration-form.md` | **NEW — generalized copy** of the live convention. |
| `ai-agents/knowledge-base/conventions/dual-home-parity.md` | Third kind added to the litmus; mirror table replaces the old parity table; stale `reviews/README.md` row corrected; prescribed check command fixed; "Known drift" snapshot deleted; enforcement section updated. |
| `ai-agents/knowledge-base/conventions/README.md` | Index gains `dependency-declaration-form.md`; the `†` footnote's byte-identical claim corrected (it was already false before this task). |
| `claude/scaffold/ai-agents/knowledge-base/conventions/README.md` | Index gains `dependency-declaration-form.md`; "Six conventions ship with the scaffold" → "Seven". |

The live `dependency-declaration-form.md` is **unchanged**. `ai-agents/wiki-vault/` was **not written**.

### The one thing I decided, and said so

The plan's "Enforced" list flagged an unresolved point: `dependency-declaration-form.md` belongs on the
enforced set *only if* shipped byte-identical, which ruling 2 says it is not. **Resolution: it is on the
exception list, as `audience-adapted`** — the same kind as the other five, for the same reason. The
enforced set is therefore four files: `conventions/priority-is-rank-not-identity.md`,
`conventions/task-owner-vocabulary.md`, `tasks/README.md`, `wiki-vault/schema.md`. All four are
byte-identical today and stay so.

### Two edits slightly wider than the plan's literal wording

1. **The live `conventions/README.md` `†` footnote.** It asserted *"Every other convention here is
   dual-homed and must stay byte-identical across both copies"* — flatly false under ruling 1, and false
   before this task too. Left alone it would contradict the module it now links. Brief verification step
   5 ("`conventions/README.md` in both homes accurately describes that home's contents") makes it
   in-scope; the fix is one paragraph.
2. **The exception module carries directory entries and runtime-state entries** beyond the plan's
   per-file table. Verification step 1 requires *every* line of a fresh `diff -r` to map to the list, and
   a `diff -rq` of the two trees emits ~440 `Only in` lines for fkit's own ADRs, briefs and wiki pages.
   Recording those at **directory** granularity (`kind: 'project-content-dir'`) keeps the mandated
   `{ path, kind, reason }` shape while making step 1 actually checkable — and it is exactly the
   "record this so it is not re-derived" the plan asked for regarding `decisions/` and `reports/`.

---

## Verification

**Baseline re-confirmed before starting** (dirty tree, pre-existing changes from other tasks present):
551 pass / 0 fail / 17 suites; `prove-red.sh` hard gate PASSED. So no red is misattributed.

**Step 1 — fresh `diff -rq` reports only exception-list paths.** ✅
Ten `Files … differ` lines, all on the list:

```
Files ai-agents/README.md and .../README.md differ                                     audience-adapted
Files ai-agents/knowledge-base/PROJECT.md and ... differ                               placeholder
Files ai-agents/knowledge-base/conventions/README.md and ... differ                    index
Files ai-agents/knowledge-base/conventions/dependency-declaration-form.md and ... differ  audience-adapted (ruling 2)
Files ai-agents/knowledge-base/conventions/evidence-before-assertion.md and ... differ  audience-adapted
Files ai-agents/knowledge-base/conventions/one-skill-one-output.md and ... differ       audience-adapted
Files ai-agents/knowledge-base/conventions/status-report-format.md and ... differ       audience-adapted
Files ai-agents/knowledge-base/conventions/task-status-vocabulary.md and ... differ     audience-adapted
Files ai-agents/wiki-vault/index.md and ... differ                                      placeholder
Files ai-agents/wiki-vault/log.md and ... differ                                        placeholder
```

Non-bulk `Only in` lines, all on the list:

```
Only in ai-agents: .fkit                                          runtime-state
Only in ai-agents/knowledge-base: .gitkeep                        runtime-state
Only in ai-agents/knowledge-base: architecture.md                 live-only
Only in ai-agents/knowledge-base/conventions: dual-home-parity.md fkit-repo-only
Only in ai-agents/knowledge-base/reports: README.md               project-content-dir (knowledge-base/reports/)
Only in ai-agents/sprints: backlog.md | reviews | sprint-2.md     project-content-dir (sprints/)
Only in ai-agents/sprints/done: sprint-1.md                       project-content-dir (sprints/)
Only in ai-agents/tasks/backlog: .fkit                            runtime-state
Only in ai-agents/wiki-vault: .fkit | .wiki-watermark             runtime-state
Only in claude/scaffold/.../{decisions,reports,incidents,history}: .gitkeep   project-content-dir
```

The remaining `Only in` lines are fkit's own project content, all covered by the `project-content-dir`
entries. **Exact census, re-derived 2026-08-01 (round 2) by a classifier run over every line of the raw
`diff -rq` output against `findException()`: 456 lines total, 456 matched, 0 unmatched.** Of those, 16
map to specific **file** entries and **440** to the 9 `project-content-dir` entries:

| Directory entry | Lines |
|---|---|
| `wiki-vault/wiki/` | 180 |
| `tasks/done/` | 128 |
| `tasks/backlog/` | 47 |
| `knowledge-base/decisions/` | 36 |
| `knowledge-base/reports/` | 25 |
| `tasks/cancelled/` | 11 |
| `knowledge-base/history/` | 6 |
| `sprints/` | 4 |
| `knowledge-base/incidents/` | 3 |
| **Total** | **440** |

⚠️ **These per-directory counts are a snapshot and will drift** — every ADR, brief or wiki page fkit
adds moves them, and two (ADR-035, task 0174's report) landed during this very sprint run. **The
durable claim is the invariant, not the census: every diff line maps to an entry, 0 unmatched.** An
earlier draft of this worklog stated the census as "~430 … ADRs (35), reports (24)"; those figures were
wrong at the time and are corrected here (R5).

**Step 2 — byte-identity.** ❌ **SUPERSEDED by owner ruling 2, not met.** See the warning at the top.

**Step 3 — regression check: `dual-home-parity.md` still absent from the scaffold.** ✅
`claude/scaffold/ai-agents/knowledge-base/conventions/` holds exactly: `README.md`,
`dependency-declaration-form.md`, `evidence-before-assertion.md`, `one-skill-one-output.md`,
`priority-is-rank-not-identity.md`, `status-report-format.md`, `task-owner-vocabulary.md`,
`task-status-vocabulary.md`. No `dual-home-parity.md`. `find claude/scaffold -name 'dual-home-parity*'`
returns nothing.

**Step 4 — the exception list exists, with a reason per entry, where 0133 can read it.** ✅
`test/dual-home-parity-exceptions.mjs`, sitting beside the test that will import it.

**Step 5 — both `conventions/README.md` files describe their own home.** ✅ Live lists 8 conventions
(7 dual-homed + `dual-home-parity.md †`); scaffold lists 7 and says "Seven conventions ship with the
scaffold". The scaffold's count was **already wrong before this task** — it said "Six" while listing
six but the live tree had seven dual-homed conventions to ship; both are now correct.

**Step 6 — test suite green.** ✅ `node --test test/*.test.js`: **551 tests, 17 suites, 551 pass, 0 fail,
0 skipped**. `bash test/prove-red.sh`: **hard gate PASSED**. Identical to baseline — this task adds no
test, so the count is unchanged by design; 0133 is the task that adds one.

**Generalization check on the scaffold copy.** No relative links into `tasks/` or `sprints/` (its only
link is `](one-skill-one-output.md)`, a sibling that exists in the scaffold). No `task 84`, `0092`,
`0107`, `0020`, `R19`, `R40`, or `ADR-` reference. The "The guard (task 0107)" section is retitled
"The guard" and keeps the guard's **behaviour** (which does ship — `dashboard.sh` is part of the
`/fkit-status` skill) while dropping fkit's history of building it. Example task numbers in the code
fences were regenericized (`0110`/`0112`/`36`/`82,83,81 Part D` → `0042`/`0043`/`0044`/`0042,0043,0044`).
**Round 2 (R6): every example ID is now the canonical 4-digit folder-name form.** The first draft left
one `task 17` in the *"examples that parse"* block — illustrative syntax, not leaked provenance, and
disclosed rather than hidden, but a 2-digit legacy ID contradicts `priority-is-rank-not-identity.md`,
which the scaffold **also** ships and which makes the folder-name `NNNN` prefix a task's only identity.
It is now `task 0044`. See "Round 2" below for why this does not blunt the example.

---

## Findings recorded (so they are not re-derived)

- **`reviews/README.md` is gone from both homes.** `ai-agents/reviews/` was absorbed into
  `ai-agents/tasks/` by the ADR-029 folder migration (commit `331f298`, task 76 — `git show` confirms
  the rename `ai-agents/{reviews => tasks}/README.md` and the scaffold copy's removal in the same
  commit). The convention's parity table still listed it as ✅ must-match; that row is corrected, with
  the history stated inline. **Task 0133 must not assert on `reviews/README.md`.** Its successor
  `tasks/README.md` is byte-identical in both homes and is on the enforced set.
- **The convention's prescribed check was structurally blind.** It said to run
  `diff -rq … | grep -v '^Only in ai-agents'` and that *"`Only in ai-agents/…` lines are expected and
  not drift"*. But `dependency-declaration-form.md`'s absence from the scaffold — the live violation this
  whole task exists to fix — appeared as exactly such a line. The grep is replaced by classification
  against the module, and the blindness is documented in place so it is not reintroduced.
- **`decisions/` and `reports/` are NOT part of the dual-homed surface.** The scaffold ships 13 real
  files plus `.gitkeep` placeholders. ADR-035 and task 0174's report are not drift events, and **no ADR
  ever will be**. Now recorded as `project-content-dir` entries.
- **ADR-027's "six drifted files" is stale in KIND, not in COUNT.** All six still differ today; **none**
  were fixed by tasks 0043/0077/0086, so the brief's guess that two may have been fixed is **wrong**.
  Five of the six were never "drift" at all — they are audience-adapted and correctly divergent. The
  correction is recorded in `dual-home-parity.md`. **ADR-027 itself is NOT amended here** — that is an
  architect/owner act. Named as a follow-up.
- **`claude/scaffold/universal-rules.md` is single-homed** and outside ADR-027's surface — task 0130
  created no drift there. Cleared.
- **Task 0178's contested home page resolves in 0178's favour** — `priority-is-rank-not-identity.md` is
  byte-identical in both homes today. Recorded; 0178's brief **not** edited (producer's file).
- **New, not previously recorded anywhere: `knowledge-base/architecture.md` is live-only.** Neither
  ADR-027 nor the convention listed it. Now an entry with a stated reason.
- **New: `knowledge-base/reports/README.md` exists live with no scaffold counterpart.** It is an
  fkit-authored folder-purpose doc sitting inside a directory the convention declares ⛔ never-sync, so
  it is covered by the `knowledge-base/reports/` directory entry and is **not** drift. Whether it
  *should* ship is a separate scoping question, not this task's.

---

## Round 2 — review response (2026-08-01)

Stateful review round 1 (`review.md`) raised **6 findings, none blocking**. The owner ruled: fix
**R2–R6** here, hand **R1** to task 0133. Verdicts and evidence live in the ledger's *Coder response*
section; what changed on disk:

| # | Fix |
|---|---|
| R2 | `dual-home-parity.md` mirror table gains the 5 missing `runtime-state` rows — the mirror now carries **all 26** module entries, and says so with a keep-in-step instruction. |
| R3 | `findException()` **normalizes** `.`, `..` and empty segments before matching; a path climbing above the home root gets **no** exception. |
| R4 | `tasks/backlog/.fkit` **made live, not removed** — `findException()` now resolves an exact entry before a covering directory entry. |
| R5 | Worklog entry count **25 → 26**; the stale `Only in` census replaced with a re-derived exact one, flagged as a snapshot. |
| R6 | Scaffold `dependency-declaration-form.md`: `task 17` → `task 0044`. |

**R4 — why made live rather than removed.** Both satisfy the finding; the entry is dead either way
today. Removing it loses the accurate reason: the line `Only in ai-agents/tasks/backlog: .fkit` would
keep matching, but under `tasks/backlog/`'s reason — *"the live tree holds fkit's own task folders"* —
which is **wrong about a generated launcher file**. The brief's whole thesis is *"record the reason, not
just the path"*, so an entry excused with the wrong reason is the failure mode this task exists to stop.
Making it live also fixes the **class**: exact-beats-directory is order-independent, so no future
re-sort of the array can silently kill an exact entry again. The rule changes the result for exactly one
path — proven below.

**R6 — how it coexists with the reviewer's `task 17` clearance.** The reviewer cleared `task 17` as
*illustrative syntax* (the parser's own doc at `dashboard.sh:287` uses `**Depends on: task 18**` as its
bold-inline example), and separately flagged the **mixed** ID forms. Both hold, and the fix serves both:
the example's job is to show (a) the bold-inline shape — the closing `**` mid-line with trailing prose —
and (b) that a `task N` prefix parses. **Changing only the digits keeps both** and drops the
contradiction with the scaffold's own `priority-is-rank-not-identity.md`. Proven, not assumed: the
parser anchor is `/\*\*Depends on[.: ]/` and the value is taken by `substr(...)` and, per
`dashboard.sh:263`, **"NEVER interpreted"** — so digit-count cannot affect parsing. Ran both lines
through the anchor: `task 17` and `task 0044` both yield `BOLD-INLINE MATCH`, identical branch.

### ⚠️ HAND-OFF TO TASK 0133 — R1, ruled out of scope here, MUST be picked up there

**R1 (medium, raised independently by both reviewers) was NOT fixed in 0132.** The owner took the
reviewer's own recommendation: **0133 owns the test, so 0133 owns the fix**, and the gap is latent.

**The assertion 0133 must add:**

> **No directory exception may cover a non-`.gitkeep` file that is present in BOTH homes.**

**Why.** The 10 directory entries match **bidirectionally** — they excuse a path under them in either
home. That is what makes the 440 lines of bulk `Only in` noise classifiable, but it also means a
genuinely dual-homed file added under one of them **later** would silently escape 0133's byte-parity
enforcement instead of being caught by it. The per-file entries have no such softness.

**Latent, not a present failure** — no such file exists as of 2026-08-01. But the mechanism is already
live: **9 `.gitkeep` files sit in both homes** under these entries (`sprints/`, `sprints/done/`,
`tasks/{backlog,done,cancelled}/`, `wiki-vault/wiki/{tasks,features,decisions,systems}/`), which is
exactly why the assertion must **carve `.gitkeep` out** rather than ban co-presence outright.

**The named near-miss:** `knowledge-base/reports/README.md` — an undated folder-purpose doc of the
**same species** as `tasks/README.md`, which **is** dual-homed and **is** enforced. It lives only in the
live tree today, so it is correctly covered by `knowledge-base/reports/`; ship it to the scaffold and it
would land under that blanket and go unchecked.

Recorded in **three** places so 0133 cannot miss it: here, in the ledger's *Coder response*, and as a
comment on the `project-content-dir` block in `test/dual-home-parity-exceptions.mjs`. **0133's brief was
deliberately NOT edited** — that is the producer's file.

### Round 2 verification

- **Classifier re-run after the R3/R4 matcher change: 456 diff lines, 456 matched, 0 unmatched.**
  R4's fix orphaned nothing — `tasks/backlog/.fkit` moved from **0** lines to **1**, and
  `tasks/backlog/` from 47 to 46; every other entry's count is unchanged.
- **R3 probe:** `findException('knowledge-base/reports/../conventions/task-owner-vocabulary.md')` now
  returns `undefined` (byte-enforced), where it previously returned the `knowledge-base/reports/` entry.
- Derived enforced set unchanged — the same four files.
- `node --test test/*.test.js`: **551 pass / 0 fail / 17 suites.** `bash test/prove-red.sh`: hard gate
  **PASSED**. No existing test file modified.
- **Verification step 3 re-confirmed:** `dual-home-parity.md` still **absent** from the scaffold.
- **Verification step 2 remains SUPERSEDED, NOT MET** — unchanged by round 2.

---

## Follow-ups (not done here)

1. **Amend ADR-027** — its "six drifted files" framing predates the audience-adapted kind. Architect/owner.
2. **Task 0133** — build `test/dual-home-parity.test.js` importing this module. Unblocked by this task.
   **Carries the R1 hand-off above as a required assertion**, not an optional extra.
3. **`/fkit-task-brief` scoping enforcement** — `dual-home-parity.md` §"Where this is enforced" still
   records that skill edit as pending. Untouched.
4. **The LIVE `dependency-declaration-form.md` has the same mixed-ID-form issue R6 flagged in the
   scaffold copy** — its examples read `0110`/`0112` alongside `task 36`, while the live tree also ships
   `priority-is-rank-not-identity.md`. **Not fixed here:** R6 is scoped to the scaffold file, the
   approved plan leaves the live copy unchanged, and editing it would widen this round beyond the five
   approved fixes. Noted so it is not lost.

---

## Round 3 — owner-approved widening: the LIVE `dependency-declaration-form.md` (2026-08-01)

**Authorized, not drift.** Follow-up 4 above (raised in round 2 and deliberately *not* acted on, because
R6 was scoped to the scaffold copy) was put to the owner, who **approved widening the round to fix the
live copy**. Owner ruling 2026-08-01, relayed through the `fkit-sprint-ship-loop` driver session. Scope
of the widening is exactly one thing: **ID-form consistency in the live copy's examples.**

**The change — one line.**

| File | Was | Now |
|---|---|---|
| `ai-agents/knowledge-base/conventions/dependency-declaration-form.md:16` | `- **Depends on: task 36** — soft, not hard.` | `- **Depends on: task 0072** — soft, not hard.` |

`0072` is not a new number: legacy **task 36** *is* folder `0072-remove-fkit-omnigent-orphan-residue`
(confirmed by `ai-agents/tasks/backlog/0046-…/brief.md:48`, whose ledger link resolves to
`done/0072-remove-fkit-omnigent-orphan-residue/review.md`). The example now names the task by its
**permanent folder ID**, which is what `priority-is-rank-not-identity.md` — shipped in this same live
tree — makes a task's only identity. All three examples in the block are now the canonical 4-digit form
(`nothing` / `0110` + `0112` / `task 0072`).

**Deliberately NOT changed, and why.** Three other legacy-form references survive in this file and are
correct as they stand:

- **`:26` "The failure it prevents (task 84 / `0092`)"** — states *both* forms on purpose; that is the
  reconciliation, not a lapse.
- **`:29` `- **⚠️ Depends on tasks 82, 83 and 81 Part D — …**`** — a **verbatim quote of what the `0092`
  brief actually wrote.** Renumbering a quotation would falsify the incident record.
- **`:37` the `0020` review, `:42`/`:65` task `0107`** — already canonical.

### The example still demonstrates what it is there to demonstrate — proven through the real parser

Not the anchor regex this time: `depends_raw()` was lifted verbatim out of
`claude/skills/fkit-status/dashboard.sh:314-449` and run against synthetic briefs.

| Probe line | Form | Value returned |
|---|---|---|
| `- **Depends on: task 36** — soft, not hard.` (old) | `BI` | `task 36` |
| `- **Depends on: task 0072** — soft, not hard.` (new) | `BI` | `task 0072` |
| `- **Depends on: task 18** trailing prose` (`dashboard.sh:287`'s own doc example) | `BI` | `task 18` |
| `- **Depends on: nothing.**` (example 1) | `BI` | `nothing.` |
| `- **Depends on:** 0110 (evolved lead) and 0112 (wiring).` (example 2) | `BL` | `0110 (evolved lead) and 0112 (wiring).` |

Old and new take the **identical `BI` (bold-inline) branch**, and the value is carried verbatim with the
trailing `— soft, not hard.` correctly cut by BI's in-band `**` terminator. So both jobs of the example
survive: **(a)** the bold-inline shape — closing `**` mid-line with trailing prose — and **(b)** that a
`task N` prefix parses. Consistent with `dashboard.sh:263`, which says the value is **"NEVER
interpreted"** — digit-count cannot reach the parse.

### The two copies stay deliberately different — not re-synced

Per the owner's option-B ruling, `dependency-declaration-form.md` ships to the scaffold **generalized**
and is on the exception list as `audience-adapted`. The two copies were **not** re-aligned. Classifier
re-run confirms the diff picture is unchanged:

| Check | Result |
|---|---|
| `diff -rq ai-agents claude/scaffold/ai-agents` | **456 lines, 456 matched, 0 unmatched** (same as round 2) |
| Dead entries | **0 of 26** |
| `conventions/dependency-declaration-form.md` | still `Files … differ` → `audience-adapted` — **expected, unchanged** |
| `node --test test/*.test.js` | **551 pass / 0 fail / 0 skipped / 17 suites** |
| `bash test/prove-red.sh` | **hard gate PASSED** |

### The exception module's reason text — checked, and correctly left alone

The recorded reason for `knowledge-base/conventions/dependency-declaration-form.md`
(`test/dual-home-parity-exceptions.mjs:160-171`) cites four specifics: the **task-84 / `0092` misreport**
narration, the **`0020` review's R19/R40** prior art, the **"The guard (task 0107)"** section, and that
the scaffold copy **drops every fkit task/review reference and the relative links into `tasks/`**.

**This edit invalidates none of them.** All three narrative citations are in sections my change does not
touch and remain byte-identical; the scaffold copy is untouched, so what it keeps and drops is unchanged.
The reason text is therefore **left exactly as it was** — deliberately, not by omission.

### Follow-up 4 above is now CLOSED

Superseded by this round. Recorded here rather than edited out of the round-2 list, so the record shows
the sequence: raised → declined as out of scope → owner approved → fixed.
