# Make the case-insensitive lockdown-guard test filesystem-independent — fkit's first CI run is red

## ID
0283

## Sprint
Sprint 5

## Priority
P17

⚠️ **`P17` is an APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
**On merit this belongs at the TOP of the board, above `0259`** — there is no row it belongs below,
because it is the only red on `main` and it is being driven the moment it is filed. That position is
**unreachable**: `/fkit-task-brief` step 5 and
[ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
forbid inserting a new row anywhere a `✅ Done` row sits below the insertion point, and nine closed rows
(`P1`–`P8`, `P10`) sit below every position above `P11`. **So it appends, and the ordering intent is
recorded here instead.**

⚠️ **This rank was assigned by THIS FILING on 2026-08-13. It is NOT part of the owner-ruled re-rank of
2026-08-11** (§"Addendum — the owner-ruled re-rank of 2026-08-11" on the board). That ruling moved six
existing rows; it said nothing about this row, which did not exist. ⛔ **Nothing here re-ranks anything.**

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Authority

**Two owner rulings, both given 2026-08-13 via `AskUserQuestion` in a live `fkit lead` session and
relayed to this filing — the option labels are the verbatim text:**

1. **"A — make the test filesystem-independent (Recommended)"**
2. **"Fix now — drive it in this session (Recommended)"**

**Provenance:** [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md)
(closed 2026-08-12) added `.github/workflows/test.yml`. The owner pushed to `main`. **GitHub Actions run
`31634593615`**, `ubuntu-latest`, returned **708 pass / 709 total, 1 fail** — fkit's first-ever CI run,
and it went red.

### What is failing

`test/orphan-cleanup.test.js:264` — **"the never-delete-lockdown-state guard is case-insensitive"**.

```
assert.match(r.stderr, /lockdown state/)   →   actual: ''
```

### The diagnosis — already done, and it is measurement, not conjecture

A coder investigated in the same session and **reproduced the CI failure on macOS** by mounting a
case-sensitive APFS image (`hdiutil create -fs "Case-sensitive APFS"`) as `TMPDIR`: **708/709, the same
single test, the same `actual: ''`**. A counterfactual run skipping only that test gave **708/708
green**.

> **Verdict: this is a TEST defect. It is NOT a product defect. `main` is NOT broken for Linux users.**

**Mechanism**, at `claude/fkit-claude-init.sh:735-751` (anchors measured 2026-08-13):

- The **skip that prevents deletion** (`continue`) fires on any line whose lower-cased form glob-matches
  `*settings*`. Pure `tr` + `case` — **no filesystem is consulted, so it behaves identically on every
  platform** — and the `continue` sits **OUTSIDE** the existence check. The guard therefore protects
  lockdown state on Linux exactly as it does on macOS.
- The **announcement** (`refused="$refused    $line — refused: fkit will never delete lockdown state"`)
  is gated on `exists`, a real `-e`/`-L` stat. **Deliberately** — the comment at `:739` says announcing
  an absent path would otherwise "nag on every launch of every project forever with nothing at stake."

The test writes `.Fkit/Settings` into `orphan-targets`. On macOS, case-insensitivity resolves that onto
the real `.fkit/settings` seeded by `seedResidue()` → `exists=1` → the refusal is announced. On Linux it
names nothing on disk → `exists=0` → the announcement is suppressed. **The assertion is really asserting
"the filesystem folded case for me."**

**Decisive probe, run by the coder:** on a case-sensitive filesystem, a list line naming the REAL path
(`.fkit/settings`) DOES fire and DOES announce. The guard is fully functional on Linux.

### ⚠️ The finding that drives the fix choice — read this before considering a skip

The failing test's **other two assertions passed on Linux while asserting nothing**:

- `assert.ok(r.code === 0 || r.code === 3)` — accepts both plausible exit codes.
- `assert.ok(existsSync(join(p, '.fkit', 'settings', 'coder.json')))` — on a case-sensitive filesystem
  `.Fkit/Settings` names no real path, so "lockdown state survived" is **trivially true**; nothing was
  ever a candidate for deletion.

**So skipping the test on Linux would leave a fully vacuous test running in CI — which is precisely
where CI runs.** That is why the owner ruled option A rather than a platform skip.

## What to build

**One change, to one file: `test/orphan-cleanup.test.js`.**

### 1. Seed the differently-cased path so it genuinely exists on both platforms

Before `runInitFrom(...)`, after `makeResidueProject()`:

```js
mkdirSync(join(p, '.Fkit', 'Settings'), { recursive: true });
```

- On a **case-sensitive** filesystem this creates a distinct, real directory.
- On **macOS** it resolves onto the already-seeded `.fkit/settings`, and `recursive: true` swallows the
  `EEXIST`.

Either way `exists=1`, the guard announces, and `.fkit/settings/coder.json` must still survive.

**What this buys:** the test now exercises the guard's **actual contract** — *a differently-cased list
line naming an existing path is refused, and the refusal is announced* — instead of testing whether the
filesystem folded case. **And it keeps the original macOS hazard covered**, because on macOS the two
paths are the same object.

⚠️ `mkdirSync` and `join` are **already imported** at `test/orphan-cleanup.test.js:13-15`. ⛔ No new
import, ⛔ no new helper, ⛔ no change to `seedResidue()` or `makeResidueProject()` — both are shared by
many tests and changing them would alter unrelated assertions.

### 2. Reword the comment at `test/orphan-cleanup.test.js:262-263`

It currently reads (verbatim, measured 2026-08-13):

```
// C5 — macOS filesystems are case-insensitive; the guards were not. A list line of `.Fkit/Settings`
// would sail past a case-sensitive `*settings*` check and then match the real lockdown state on disk.
```

⚠️ **That explains a macOS-only rationale that will no longer describe what the test does.** After the
change the test asserts a platform-independent contract. **Do not leave it stale.** The reworded comment
must keep the **C5 provenance** (why the guard exists at all — the macOS hazard is real history and stays
readable) **and** state what the test now proves and why the seeding line is there, so the next reader
does not delete the `mkdirSync` as redundant.

## Verification steps

1. **Reproduce the red first, then fix.** Show the failing test red on a case-sensitive filesystem
   **before** the change. Known-working recipe (used by the diagnosis):
   `hdiutil create -fs "Case-sensitive APFS"`, mount it, point `TMPDIR` at it, run the suite. ⚠️ **A
   default macOS run cannot see this class of defect** — a green run there proves nothing about the fix.
2. **`npx --yes node --test test/orphan-cleanup.test.js` (or `npm run test:unit`) green on a
   case-sensitive filesystem**, after the change. State measured pass/fail counts.
3. **Full `npm test` green on a case-sensitive filesystem — BOTH halves.** ⚠️ `package.json:5` is
   `node --test test/*.test.js && bash test/prove-red.sh`; the `&&` **short-circuits**, so a red unit
   suite means `prove-red.sh` never ran. Report the unit counts **and** `prove-red.sh`'s own result
   separately.
4. **⚠️ MEASURE `prove-red.sh` GREEN — do not infer it.** See the honesty flag in `## Notes`: nobody has
   yet *observed* `prove-red.sh` green under case-sensitivity. That it passes once this one test is fixed
   is a **well-supported inference, not a measurement**. **This step is the measurement.** Confirm
   baselines `0a` (real launcher green) and `0b` (unmutated copy green) both pass.
5. **Full `npm test` green on a normal macOS run too** — the fix must not regress the default path.
   State the counts.
6. **`git diff --stat` lists exactly one path**: `test/orphan-cleanup.test.js`. Show it.
7. **The reworded comment is quoted in full** in the close, with a sentence on what changed and why.
8. **The true proof is a green Actions run.** ⚠️ A local case-sensitive run is strong evidence and is
   what this task can measure; **it is not the same thing as CI passing.** State plainly in the close
   whether an Actions run was observed green or not — and if not, say the CI half is **inferred, not
   measured**, in those terms. ⛔ Do not claim CI is green without a run ID.

## Constraints

- ⛔ **No product change. `claude/fkit-claude-init.sh` must NOT be edited.** The guard is correct; the
  `exists`-gated announcement at `:739` is deliberate and documented. Changing it to announce absent
  paths would reintroduce the nag the comment exists to prevent.
- ⛔ **No `.github/workflows/test.yml` change.** The workflow found a real defect. It is working.
- ⛔ **No `claude/orphan-targets` change.**
- ⛔ **No `test/dashboard-contract.test.js` change.** ⚠️ **Sweep result, measured at filing: exactly one
  test carries this assumption.** `dashboard-contract.test.js:2650-2673` is the only other case-aware
  test and **already handles it correctly** — it uses `Qlan-`/`plan-` precisely because macOS would
  collide `Plan-`/`plan-`. **It is a model of the right pattern, not a defect. Leave it alone.**
- ⛔ **No new devDependency** ([ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)).
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  no re-rank, no other task's status touched.
- ⛔ **No commit, no push.**
- ⚠️ **Every `:NNN` in this brief is a dated anchor measured 2026-08-13; the durable anchor is the quoted
  text. Re-measure at implementation time.**

## Notes

- **Depends on:** nothing. **Blocks:** nothing formally — but `main` stays red until it lands, so in
  practice it precedes any further push.
- **Provenance:** [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md)
  (closed 2026-08-12) → GitHub Actions run **`31634593615`** (`ubuntu-latest`, 708/709, 1 fail) →
  diagnosis in a live `fkit lead` session 2026-08-13 → owner rulings **"A — make the test
  filesystem-independent (Recommended)"** and **"Fix now — drive it in this session (Recommended)"**,
  both 2026-08-13 via `AskUserQuestion`.
- **⚠️ HONESTY FLAG, carried from the diagnosis and not to be dropped:** the coder **did NOT observe
  `prove-red.sh` green** under case-sensitivity. `prove-red.sh` invokes `node --test` internally and a
  skip pattern could not be injected without editing a file, which was out of bounds for a diagnosis.
  **What IS measured:** `prove-red.sh` also goes red on a case-sensitive filesystem, at baselines `0a`
  and `0b` only, from the **same single root cause** — hidden in the CI run because `package.json`'s
  `&&` short-circuited. Mutants 1–15 all behaved correctly and `0c`–`0i` were green, **so the mutation
  gate itself is healthy.** Verification step 4 exists to turn the inference into a measurement.
- **⚠️ Residual vacuity, recorded deliberately and NOT scoped:** after this fix, the announcement
  assertion is real on both platforms, but `assert.ok(existsSync(join(p, '.fkit', 'settings',
  'coder.json')))` **stays trivially true on a case-sensitive filesystem** — `.Fkit/Settings` is a
  different object there, so `coder.json` was never a deletion candidate. The contract genuinely proved
  cross-platform is *"a differently-cased line naming an existing path is refused and announced."* A
  second list line naming the real `.fkit/settings` would make the survival assertion bite on both
  platforms, **but that changes what the test tests and the owner ruled option A specifically.**
  ⛔ **Out of scope. Recorded so the next reader knows it was seen, not missed.**
- **On merit:** top of the board. It is the only red on `main`, it blocks trusting every future CI run,
  and it is being driven immediately. Its append rank at `P17` reflects the closed-row rule, **not** its
  importance.
- **Blast radius if never done:** every subsequent Actions run is red, so CI reports nothing usable and
  the team learns to ignore it — which retires the value `0256` was filed to create. Meanwhile the one
  test covering the C5 lockdown-state hazard remains a filesystem probe rather than a contract test, so
  a real regression in that guard could land green on macOS.
- Filed 2026-08-13 by a spawned `fkit-producer` with **no owner channel**, on the two owner rulings
  quoted above. It asked nothing, wrote no source, moved no task file, changed no other task's status,
  re-ranked nothing, and committed nothing.
