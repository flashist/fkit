# Correct the superseded runtime figure — and the forbidden duration list — on the `gate-releases` vault page

## ID
0297

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-wiki

## Context

**The page:** `ai-agents/wiki-vault/wiki/tasks/gate-releases-so-an-untested-tree-cannot-ship.md`.
**Two sites, both verified on disk 2026-08-14:**

- **`:54`** — *"…since **~6 minutes** separate the gate from `git add -A`."*
- **`:56`** — *"**Measured suite runtime: ~5m30s–6m20s** across four local runs (328 / 380 / 347 / 344
  s), i.e. ~55 s of unit tests plus `prove-red.sh` re-running the suites against 15 mutants and 9 clean
  baselines."*

**Both are superseded.** The owner ruled **2026-08-13**, verbatim option label
***"Range: 'roughly 6–8 minutes, machine-dependent'"*** — and that ruling **overrode an earlier `~6 min`
ruling of the owner's own.** The ruled wording is live at `RELEASING.md:128`, verified 2026-08-14:
*"A green run takes **roughly 6–8 minutes, machine-dependent**."* The vault page still carries the
figure the owner replaced.

### ⚠️ `:56` is worse than stale — it publishes the exact thing `0291` forbade

[`0291`](../../done/0291-correct-two-stale-vault-claims-surfaced-by-0258s-review/brief.md) barred
publishing a **list of per-run durations**, and the reason is on its record at `:100-102`: a sweep on
2026-08-13 could locate `328`, `344`, `347`, `380`, `404` and `448` s on disk, but **could not
reproduce** the remaining figures — and `0291` turned that unreproducibility into a **constraint**, not
a footnote. `:56` publishes `328 / 380 / 347 / 344` as *"four local runs"*, which is precisely the
shape the constraint bars.

**⛔ THE FIX STATES THE RULED RANGE. ⛔ IT DOES NOT PUBLISH A CORRECTED LIST.** Replacing four numbers
with six better-sourced numbers is **not** the fix — it is the same defect with fresher data. The
per-run tally goes; the ruled range stays.

### Why this is not already owned — ⚠️ state BOTH, so nobody suppresses it as settled

1. **`0291` did not cover it.** `0291` scoped its item-1 fix to `ai-agents/wiki-vault/index.md`
   (`:94`, *"touches `index.md` and nothing else for item 1"*; `:220`, *"If the same superseded figure
   appears on a **content page**… report it as a finding; do not run it here"*). **This page is a
   content page, and that reporting instruction is exactly what surfaced it.** `0291` closed correctly;
   it simply did not own this site.
2. **`0252`'s accepted residual does not cover it either.** That residual names **`bin/release.mjs`**
   and **`.github/workflows/test.yml`** — verified 2026-08-14 at
   [`0252`](../../done/0252-record-fkits-release-hygiene-channel-version-role-and-manifest-duty/brief.md)
   `:29-42`. **It names no vault page at all.** A reader who remembers "the runtime figures were already
   handled" is remembering a residual about **two source files**, not this one.

## What to build

**One editing pass, on one page.**

1. **`:54`** — replace the superseded `~6 minutes` with the ruled wording,
   ***roughly 6–8 minutes, machine-dependent***. The sentence's point is that *time passes between the
   gate and `git add -A`*; keep that point and change only the figure.
2. **`:56`** — restate the runtime as the **ruled range**, and **⛔ remove the per-run duration list
   entirely**. The surrounding sentence's genuine content — that the cost is ~55 s of unit tests plus
   `prove-red.sh` against 15 mutants and 9 clean baselines, and that this is *"the cost the owner
   accepted, stated rather than implied"* — is **correct and stays**. ⛔ Do not delete the paragraph;
   ⛔ do not replace the four numbers with different numbers.
3. **Cite the authority in the page**, so the next reader does not "correct" it back: the ruling is
   **owner, 2026-08-13**, and its live wording is at `RELEASING.md:128`.

### ⚠️ Report any further occurrences — do not hunt them, do not fix them

⛔ **Scope is this one page.** This is **not** a vault-wide `~6 min` sweep. **But if the librarian
encounters the superseded figure or a duration list elsewhere in the vault while doing this work, it
MUST report each occurrence — file and line — in its close**, exactly as `0291` was required to and
exactly as produced this brief. ⛔ Reporting is not fixing: an occurrence found is written into the
report, not edited.

## Verification steps

All runnable from the repo root.

1. **The superseded figure is gone from the two sites:**

   ```sh
   grep -n '~6 minutes' ai-agents/wiki-vault/wiki/tasks/gate-releases-so-an-untested-tree-cannot-ship.md
   grep -n '5m30s\|6m20s' ai-agents/wiki-vault/wiki/tasks/gate-releases-so-an-untested-tree-cannot-ship.md
   ```

   **Expect: no output from either.** (Measured 2026-08-14, before the fix: `:54` and `:56` respectively.)

2. **The ruled range is present:**

   ```sh
   grep -n '6–8 minutes, machine-dependent' \
     ai-agents/wiki-vault/wiki/tasks/gate-releases-so-an-untested-tree-cannot-ship.md
   ```

   **Expect: at least one hit.** ⚠️ **Use the en-dash `–`, not a hyphen** — the ruled wording carries an
   en-dash, and a hyphen search silently finds nothing and passes as if it had.

3. **⛔ NO DURATION LIST WAS PUBLISHED — the load-bearing check:**

   ```sh
   grep -nE '\b(328|344|347|380|404|448|435|456|460|463)\b' \
     ai-agents/wiki-vault/wiki/tasks/gate-releases-so-an-untested-tree-cannot-ship.md
   ```

   **Expect: no output.** ⚠️ A hit here means the fix reintroduced the very thing `0291` barred, whether
   or not the numbers changed.

4. **The surviving content is intact** — the `15 mutants` / `9 clean baselines` / *"cost the owner
   accepted"* sentence is still on the page:

   ```sh
   grep -n '15 mutants' ai-agents/wiki-vault/wiki/tasks/gate-releases-so-an-untested-tree-cannot-ship.md
   ```

   **Expect: at least one hit.**

5. **Change surface is exactly two files** — this page and the vault's `log.md` entry for the run
   (plus this brief's `## Status`). ⚠️ **A sync batched with this row will legitimately touch more; the
   close must state which writes belong to this row and which belong to the sync.**

   ```sh
   git status --porcelain
   ```

6. **⚠️ `npm test` proves NOTHING about this row** — no test in `test/*.test.js` reads vault prose.
   The close must say so rather than citing a green suite as evidence.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** surfaced by
  [`0291`](../../done/0291-correct-two-stale-vault-claims-surfaced-by-0258s-review/brief.md)'s
  content-page **reporting** instruction (`:220`, `:246`). **Owner ruling 2026-08-14, verbatim option
  label: *"Fold into the mechanism task's filing run"*** — meaning filed in the **same run** as
  [`0296`](../0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md), as its **own
  separate brief**. ⛔ The two tasks are **unrelated in substance** and share nothing but a filing run;
  do not treat `0296` as context for this work.
- **⛔ RUNS IN A `fkit wiki` SESSION, NOT `/fkit-sprint-ship-loop`.** Vault writes are `fkit-wiki`'s
  **exclusively**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
  and the loop's Build step is fixed to `@fkit-coder`
  ([ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)),
  which may not write the vault. That is an **exclusion from the loop and nothing else**: **NOT
  blocked, NOT deprioritised, NOT descoped.**
- **⚠️ A SYNC IS CURRENTLY OWED — batch this row with it, do not run it as a standalone write.**
  Measured 2026-08-14: `ai-agents/wiki-vault/.wiki-watermark` reads **`cd543f1`** while `HEAD` is
  **`e706b0c`**. A standalone edit adds another isolated write to the vault while a delta is already
  pending; folding it into the owed `/fkit-wiki-sync` run costs one write instead of two and lets the
  same log entry carry both.
- **⛔ Scope is that one page** plus the vault `log.md` entry for the run. ⛔ No `RELEASING.md`, no
  `bin/release.mjs`, no `.github/workflows/test.yml`, no `ai-agents/wiki-vault/index.md` (`0291` already
  fixed that one), no `ai-agents/knowledge-base/`.
- **⛔ No mover** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
  — the close goes through `/fkit-task-done`, producer-only, carrying the
  `(agent-closed — not owner-verified)` marker if the owner is absent), **⛔ no re-rank**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  **⛔ no commit.**
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`. **Unranked** —
  the backlog is unranked by design, and a spawned producer with no owner channel ranks nothing.
