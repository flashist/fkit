# 0133 — implementation plan (approved by the owner 2026-08-01)

Approved in the `fkit-lead` session via `AskUserQuestion`, in full, with all four flagged decisions
ruled the coder's way. Implemented as a `fkit-sprint-ship-loop` Build worker under the loop's
declared-approval marker (ADR-032 Decision 3).

## Deliverables

1. **`test/dual-home-parity.test.js`** — `node --test`, zero devDeps (ADR-014).
2. **`test/prove-red.sh`** — step `0h` (unmutated scaffold copy green) plus mutations **10–13**.
3. **`ai-agents/knowledge-base/conventions/dual-home-parity.md`** — retire the now-false
   "not yet built — task 0133" statements.

Explicitly **not** touched: `test/dual-home-parity-exceptions.mjs` (0132's just-shipped artifact).

## The design

- **Union walk.** Iterate the union of both homes, never one side. A "for each scaffold file, compare
  to live" loop is structurally blind to the `dependency-declaration-form.md` bug — the file is not in
  the scaffold to iterate over.
- **Derived enforced set, never hard-coded.** The enforced set is whatever the union walk leaves after
  the exception list is subtracted. Hard-coding it would leave a new dual-homed file unguarded until
  somebody remembers to add it, which is the failure the test replaces. A non-vacuity assertion stops a
  derived-to-empty set passing trivially.
- **Six named tests**, plus two that pin the tripwire's carve-out. Failures accumulate **per class**
  rather than throwing on first hit — four drifted files should report four paths, not force four runs.
- **One seam, scaffold-side:** `FKIT_PARITY_SCAFFOLD_ROOT`, with a loud stderr warning when non-default
  (mirroring `harness.mjs`'s `FKIT_LAUNCHER`). All four mutations are expressible scaffold-side, so the
  live tree needs no seam and a stale env var can never redirect fkit's own working tree.
- **Rich byte-drift message** — path, line, column, both lines clipped around the difference, both
  sizes, and a truncation case (two files with no differing byte at all).

## The four owner decisions

| # | Decision | Ruling |
|---|---|---|
| §0.1 | **Prune the walk** — at a directory whose home-relative path already has a covering exception, stop and do not descend | Approved as recommended. Matches `diff -rq` semantics and the module's own stated meaning of a directory entry. The rejected alternative — editing the exceptions module — would have re-killed 0132 R4's fix via array order. |
| §2.5 | **Tripwire on prune points**, not on the literal "directory exception" wording | Approved as recommended. `wiki-vault/.fkit` is an *exact* entry (no trailing slash) naming a *directory* on disk; a co-present file under it escapes by the identical mechanism. Free at this shape. |
| §2.4 | **Keep the 30-character floor** on each exception `reason`; `kind` checked non-empty only | Approved as recommended. `kind` is deliberately not checked against the 7-value vocabulary — that would make this file a second source of truth for it. |
| §7 | **0112: report NOT APPLICABLE**, run the substitute check, producer files a follow-up | Approved. See `worklog.md` §0112. |

## Rejected alternatives — stay rejected, do not re-litigate

- **A dead-exception-entry check** (assert every entry still matches something) — would go red on a
  fresh clone, since `.fkit/` is gitignored and therefore absent.
- **Walking `git ls-files`** — `prove-red.sh` runs outside any repo, and it misses untracked-but-real
  files, which is the very class the test is for.
- **Special-casing `.fkit` inside the test** — the exceptions module already names it; a second
  spelling in the test is a second source of truth.

## Build against the ruling, not ADR-027's current text

ADR-027 §Decision 2 still mandates byte-aligning every dual-homed file on disk. The owner overruled
that during 0132 (the **audience-adapted** third kind). **Task 0186 will amend the ADR.** The test
implements the ruling and says so in its header, so the next reader is not misled by the stale ADR.

## Verification

Step 0 baseline before any edit (both halves) → build → four hand-broken trees read as a human →
`prove-red.sh` mutations 10–13 → full `npm test` → the 0112 substitute check.
