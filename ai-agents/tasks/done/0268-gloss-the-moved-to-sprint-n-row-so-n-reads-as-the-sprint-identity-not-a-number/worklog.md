# Worklog — task 0268

Gloss the `Moved to [Sprint N]` row so `N` reads as the sprint's identity, not a number.

**Worker:** coder, spawned as the Build worker by `/fkit-sprint-ship-loop` (lead session), under the
declared-approval marker. Plan approved by the owner 2026-08-12 via `AskUserQuestion` in the driver
session; plan body at `plan.md` in this folder.

**Date:** 2026-08-12

---

## What was done

Implemented the approved plan exactly, in three steps.

### 1. Live convention — `ai-agents/knowledge-base/conventions/task-status-vocabulary.md`

Inserted the gloss at `:24-26`, immediately after the status table and before the existing
`**No other value is valid.**` paragraph. The `**Moved**` (`:21`) and `**Moved (to backlog)**` (`:22`)
rows were **not** touched.

### 2. Scaffold twin — `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md`

Same text at `:23-25`, same position (after the table, before `**No other value is valid.**`). The
`**Moved**` row (`:21`) was **not** touched.

The inserted text, identical in both homes:

```
⚠️ **`N` in the `Moved to [Sprint N]` marker is the target sprint's *identity*, not a number** — `4`,
or `4c`. Write it exactly as that sprint's own plan names itself: `Sprint 4` and `Sprint 4c` are
different sprints.
```

⚠️ **The twin edit is unenforced** — `test/dual-home-parity-exceptions.mjs:129-139` excepts this path
as `audience-adapted`, so editing one home and not the other is silent. Both homes were therefore
edited deliberately and the inserted block was diffed by hand (see evidence below): byte-identical,
`sha256 5658724dc03ef7d6e7fad79fc49501d17d5d01feff999552b8bb9475794fc4b7` for the three-line block in
both files.

### 3. Manifest regen — `claude/structure-manifest.tsv`

`npm run generate:manifest` → `wrote claude/structure-manifest.tsv — 66 entries`. Added exactly one
row, as the plan predicted (4 → 5 hashes for this project path, now `:75-79`):

```
+05256d546ec72ae57d38088feecc25c3bd702c0ba08c26b0a6c633622ef05b3d	ai-agents/knowledge-base/conventions/task-status-vocabulary.md
```

That hash equals the new scaffold blob's `sha256` exactly (verified with `shasum -a 256`).

The **live** copy now hashes to `b2f8480f09a7c64d1a5eecb9ec5ed4360389d7656b1a640a0b4b206a07610dcc`,
which appears in no manifest row — i.e. this repo's own live copy still classifies as owner-edited,
exactly as it did before the change (it was `a0ecac97…`, also in no row). **No classification change.**

---

## Verification run here (build-time sanity only)

Full verification is a separate spawn. What was actually run this turn:

| Check | Result |
|---|---|
| Inserted block byte-identical across both homes (`diff`, exit 0) | ✅ |
| New manifest hash == new scaffold blob `sha256` | ✅ |
| `node --test test/structure-manifest.test.js test/structure-notice.test.js test/dual-home-parity.test.js` | ✅ 28 tests, 28 pass, 0 fail |
| `git diff --stat` over my three paths | ✅ exactly 3 files, `+4 / +4 / +1` |

⛔ **NOT run here, and therefore NOT claimed green:** the full `npm test` suite (target 709/709) and
the `prove-red.sh` hard gate; the plan's verification step 1 (the throwaway `Sprint 4c` dashboard
fixture proving the suffix parses, plus the T9 `dashboard-contract` result). The driver scoped this
spawn to cheap sanity checks and routed full verification to a separate spawn. Those are outstanding.

Plan verification step 2, **as amended by owner ruling 2**: the two tables differ only in ways that
pre-date this change (the live copy carries a `**Moved (to backlog)**` row at `:22`; the scaffold
table has no such row and ends at `:21` — finding F1, pre-existing), and this change appears
identically in both. Confirmed on disk this turn.

---

## Decision log — decisions taken without asking

**none.**

No fix was applied beyond the approved plan, and no obvious-winner call was made. The plan specified
the exact insert text, the exact position in both homes, and the exact command to run; execution was
mechanical throughout. Nothing was encountered that required a judgment call, so nothing was decided
unattended.

---

## Scope kept — what was deliberately not touched

Per the plan's constraints and owner rulings 2 and 3:

- ⛔ The marker syntax — unchanged.
- ⛔ No status value added; the `**Moved (to backlog)**` row — untouched.
- ⛔ The parity exception's `reason` in `test/dual-home-parity-exceptions.mjs` — untouched. Per plan §7
  it never claimed the tables were identical, and the gloss lands identically in both homes, so
  nothing it says became false.
- ⛔ The brief — not edited (owner ruling 2 explicitly forbids editing its step-2 text).
- ⛔ `status-report-format.md` (F3) and `claude/skills/fkit-task-brief/SKILL.md:351` (F2) — not
  touched; owner ruling 3 files both as separate tasks, and the driver routes that filing to a
  producer.
- ⛔ `claude/skills/fkit-status/dashboard.sh` — untouched.
- ⛔ `ai-agents/wiki-vault/` — never written.
- ⛔ Nothing committed or pushed.
- ⛔ `plan.md` was read, never re-authored.

The working tree also holds tasks 0266/0267's shipped work, task folders `0276`/`0277`, an edited
`ai-agents/sprints/backlog.md` and `0269` brief, and the driver's `🔄 In progress` marks. **None of
that is this task's** and none of it was modified here.

---

# Verification run — 2026-08-12

**Worker:** coder, spawned as the **Verify worker** by `/fkit-sprint-ship-loop`. Verification only —
no implementation. **Nothing was fixed, because nothing verified broken.** Plan `plan.md` read at blob
`f33638f024c95156ea7931383162172b02979b0b` (11969 bytes) — pointer **verified** with `git hash-object`,
so the checklist below is the approved one.

**Result: all five steps PASS.**

## Step 1 — the suffix actually parses ✅ PASS

Throwaway fixture built in the session scratchpad (**never** in the repo, never under `ai-agents/`);
`git status` confirmed zero fixture paths inside the repo.

**1a. Positive** — plan row `| ➡️ Moved to [Sprint 4c](../sprint-4c.md) — priority 3 | 1 | Alpha |
[`a.md`](../tasks/backlog/0001-a/brief.md) |` against a brief reading `## Sprint` / `Sprint 4c`:

```
⟦fkit-dashboard v1⟧
⟦BOARD⟧
| Status | # | Task | Filename | Owner | Next step |
|---|---|---|---|---|---|

1 moved  —  of 1
⟦FACTS⟧
total 1
count moved 1
⟦END⟧
exit=0
```

**Zero `drift disagreement`** — in fact zero `drift` facts of any kind.

**1b. Negative (proves the check is not vacuous)** — same row, brief reading `Sprint 4`:

```
⟦FACTS⟧
total 1
count moved 1
drift disagreement 0001 plan="➡️ Moved to [Sprint 4c](../sprint-4c.md) — priority 3" brief_sprint="Sprint 4" moved_target="Sprint 4c"
⟦END⟧
```

The disagreement fires **and** reports `moved_target="Sprint 4c"` — the suffix survived the parser.
Together 1a/1b prove the gloss documents behavior that genuinely exists.

**1c. T9** — `node --test test/dashboard-contract.test.js` → **real exit 0**, 143 tests / 143 pass / 0 fail:

```
✔ ADR-040 T9: a `➡️ Moved to [Sprint 4c]` target keeps its suffix (133.409125ms)
```

## Step 2 — twin parity by hand ✅ PASS (per **owner ruling 2**, amended wording)

The automated parity check is **off** for this path (`test/dual-home-parity-exceptions.mjs:129-139`),
so this hand check is the only thing that catches a one-home edit. Applied the **amended** step 2; the
brief's original step-2 text was **not** edited.

**(a) The tables differ only in ways that pre-date this change.** Table-row divergence at `HEAD`
(before the edit) and in the working tree (after) is the **same single row**:

```
--- at HEAD (BEFORE the edit) ---
< | **Moved (to backlog)** | `➡️ Moved to [Backlog](backlog.md)` | De-scoped from a sprint … | Producer |
--- working tree (AFTER the edit) ---
< | **Moved (to backlog)** | `➡️ Moved to [Backlog](backlog.md)` | De-scoped from a sprint … | Producer |
```

Identical before and after — this is finding **F1**, pre-existing, and this change added nothing to it.
The rest of the `diff` is the file's declared `audience-adapted` editorial divergence (opening frame,
enforcement list, ADR citations) and is likewise unchanged by this edit.

**(b) This change appears identically in both homes.**

```
live     :24-26  |  sha256 5658724dc03ef7d6e7fad79fc49501d17d5d01feff999552b8bb9475794fc4b7
scaffold :23-25  |  sha256 5658724dc03ef7d6e7fad79fc49501d17d5d01feff999552b8bb9475794fc4b7
```

Byte-identical, and the gloss appears in **no** hunk of the two-home `diff` — confirming it did not
become a new divergence.

## Step 3 — `test/structure-manifest.test.js` ✅ PASS

**Real exit 0**, 5 tests / 5 pass / 0 fail, including *"A — the committed manifest is byte-exactly what
the generator produces today"* — so the manifest regen was actually run and is not stale.

## Step 4 — `npm test` full suite ✅ PASS

**Real exit code 0.** `ℹ tests 709 · pass 709 · fail 0 · cancelled 0 · skipped 0 · todo 0`, zero `✖`
lines. Hits the plan's 709/709 target exactly.

The `prove-red.sh` hard gate also passed — all 9 baselines green and all 15 mutations red on their
named assertion, including mutation **14** (*"move-target extractor reverted to Sprint-only — `0210/A`
should go RED"*), which is the guard directly protecting this task's premise:

```
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

## Step 5 — `git diff --stat` scope ✅ PASS

0268's own paths are **exactly three**, as the plan predicted:

```
 ai-agents/knowledge-base/conventions/task-status-vocabulary.md                  | 4 ++
 claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md  | 4 ++
 claude/structure-manifest.tsv                                                   | 1 +
```

plus this folder's `brief.md` (driver's In-progress mark **only** — verified as a lone
`-🔲 Backlog` / `+🔄 In progress` hunk; the brief's step-2 text is untouched) and the untracked
`plan.md` / `worklog.md`.

**Every other changed path in the tree belongs to the declared earlier-in-this-run set** (0266/0267
shipped source and their moved `done/` folders, `0276`/`0277`, the amended `0269` brief,
`ai-agents/sprints/backlog.md`, `ai-agents/sprints/sprint-5.md`, `README.md`). Checked mechanically by
subtracting both sets from `git status --porcelain`: **no residue**. **No scope violation.**

## Extra check — the gloss does not contradict what shipped earlier today ✅ PASS

- **No filename-derived claim reintroduced.** The gloss contains no `filename`, `.md`, `sprint-*`,
  glob, or pattern token. It routes the reader to *"that sprint's own plan names itself"* — the plan's
  self-naming, i.e. resolved identity — which is exactly what 0266/0267 landed (*"no pattern on the
  filename"*, *"the filename is not what decides that"*). Consistent, not contradictory.
  ℹ️ *Observation, not a defect:* rung 2 of the identity ladder **does** read the filename
  (`plan-sprint-7.md` → `Sprint 7`, test T10), so *"names itself"* is a superset of the H1 rung rather
  than a claim about the H1 alone. It asserts no filename **pattern**, so it reintroduces nothing.
- **ADR-041 §5 respected — the identity token grammar is not restated.** The gloss contains no
  character class, regex, or any of `digit` / `letter` / `lowercase` / `suffix` / `optional` /
  `grammar`. It gives two illustrations (`4`, `4c`) and names the source of truth. §5's binding target
  is in any case the `SKILL.md` selection prose that must obtain identity **from `dashboard.sh`**; a
  human-facing vocabulary gloss with no grammar in it does not create a second grammar.

## Nothing fixed

No check failed, so **no code or prose was changed by this verification spawn**. `plan.md` was read,
never re-authored; the brief was not edited; nothing was committed or pushed; `ai-agents/wiki-vault/`
was never written.

---

# Process-review run — 2026-08-12

**Worker:** coder, spawned as the **Process-review worker** by `/fkit-sprint-ship-loop`, under the
declared-approval marker. Applied the `fkit-process-stateful-review` method against `review.md`.
Plan read at blob `f33638f024c95156ea7931383162172b02979b0b` (11969 bytes) — pointer **verified**
with `git hash-object`.

**Result: R1 verified CORRECT and FIXED. One fix applied unattended, under standing approval.**

## Decision log — decisions taken without asking

**One fix applied without asking.**

**Fix 1 — R1: dropped the "names itself" clause from the gloss, both homes.**

- **Which finding it answers:** R1, the sole finding in the ledger — raised independently by both
  reviewers. The clause *"Write it exactly as that sprint's own plan names itself"* pointed at rung 1
  (the H1) of a **two**-rung identity ladder; `resolve_identity` falls through to rung 2, the filename
  stem.
- **What changed:** in **both** `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` and
  `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md`, the sentence
  `Write it exactly as that sprint's own plan names itself:` was deleted. The `4` vs `4c` contrast —
  the gloss's actual purpose — was **kept**. Resulting text, byte-identical in both homes
  (`sha256 eb95d989483cbc5e29d5816409535116264098de6c7a97db0f60f5dc0f77a350`, 167 bytes):

  ```
  ⚠️ **`N` in the `Moved to [Sprint N]` marker is the target sprint's *identity*, not a number** — `4`,
  or `4c`. `Sprint 4` and `Sprint 4c` are different sprints.
  ```

  Consequential edit: `claude/structure-manifest.tsv` regenerated (`npm run generate:manifest`) —
  the scaffold blob changed, so its row changed to `145b38c0…`; the pre-fix `05256d54…` row is gone.
- **Why it qualified for unattended application:** **owner-ruled, not my judgment.** The driver took a
  fresh `AskUserQuestion` ruling on R1 *after* the review — verbatim option label *"Drop the \"names
  itself\" clause (Recommended)"* — and passed it in the spawn prompt. So the disposition was decided by
  the owner; my part was mechanical. It also meets the ADR-019 bar independently: **verified `CORRECT`**
  (re-derived from `dashboard.sh` and reproduced end to end, see below), **mechanical and localized**
  (deletion of one clause inside a single sentence, in two files already in this task's diff), and
  **inside the approved plan** (the plan authored this exact paragraph; the fix removes one clause of it
  and adds nothing).

**How I verified R1 before applying it** — I did not act on the report alone:

- `bash dashboard.sh identity <fixture>/plan-sprint-4c.md` with H1 `# Sprint 4 carryover` → **`Sprint 4c`**,
  exit 0. Rung 1 refuses, rung 2 (the filename stem) answers — the premise holds.
- End-to-end: plan row `➡️ Moved to [Sprint 4](…)` against a brief reading `Sprint 4c` →
  `drift disagreement … moved_target="Sprint 4"`. The predicted consequence fires.
- Concurred with **LOW** severity on the reviewer's reasoning (no live board depends on rung 2; the
  failure is loud, not silent).

**No obvious-winner call was made.** The one judgment that could have been mine — *how* to repair the
clause, given that every obvious repair brushes a settled constraint — was already the owner's, taken
before this spawn started. Nothing else in the round required a decision.

## Verification after the fix

| Check | Result |
|---|---|
| Both homes byte-identical (`diff` empty; parity check is **OFF** for this path, so hand-checked) | ✅ `eb95d989…`, 167 bytes each |
| Amended step 2 — tables differ only in pre-dating ways, change appears identically in both | ✅ divergences all pre-date (intro frame, `Moved (to backlog)` row, enforcement list); added block identical in both `git diff` hunks |
| `npm run generate:manifest` re-run; row matches on-disk scaffold blob | ✅ `145b38c0…` == `shasum` of the scaffold file |
| Live copy still hashes to no manifest row (owner-edited, unchanged classification) | ✅ `7bb85d1a…`, in no row |
| `npm test` | ✅ **real exit code 0** — 709 tests, 709 pass, 0 fail; `prove-red.sh` hard gate PASSED |

## Scope kept

⛔ No marker syntax change, no new status value, no `**Moved (to backlog)**` row edit, no parity-exception
`reason` edit, no brief edit, no `dashboard.sh` edit. ⛔ F2/F3 **not** filed and **not** fixed here — the
driver routes that. ⛔ Nothing committed or pushed. ⛔ `ai-agents/wiki-vault/` never written. ⛔ `plan.md`
read, never re-authored. ⛔ Wrote only the *Coder response* and *Accepted residuals* sections of
`review.md` — never the reviewer's findings.
