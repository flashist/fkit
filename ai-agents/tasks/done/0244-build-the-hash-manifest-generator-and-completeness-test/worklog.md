# Worklog — 0244: the hash-manifest generator and its completeness test

**Builder:** fkit-coder, spawned as the `/fkit-sprint-ship-loop` Build worker under the loop's
declared-approval marker (owner approved the plan via `AskUserQuestion` in the live lead session,
2026-08-07). Plan carried verbatim in the spawn prompt; hash-verified against
`plan.md` on start (`git hash-object` → `0b617492ba2fdc8d34ba49a4299e9a93ace4d5bf`, 13228 bytes —
matched the driver's pin).

## What was built

| File | What |
| --- | --- |
| `test/structure-manifest.test.js` | NEW — the completeness/contract test (assertions A–E per the plan). Written FIRST, run red (below). |
| `bin/generate-structure-manifest.mjs` | NEW — the generator: one `git log --full-history -m --raw --no-renames --no-abbrev` pass over the 7 walk paths + one `git cat-file --batch`, plus the current `claude/scaffold/` working tree. Exports `hashFor` / `markerLines` / `normalizeEndings` / `elideRulesRegion` / `generateManifest` so the test imports the contract instead of re-implementing it. |
| `claude/structure-manifest.tsv` | NEW — the committed manifest artifact: static contract header + 63 `<sha256>\t<path>` entries over 17 project paths. |
| `package.json` | EDIT — added `"generate:manifest": "node bin/generate-structure-manifest.mjs"`. |

Nothing else touched. `git status` under `ai-agents/` after the generator run: only the driver's own
pre-existing sprint bookkeeping (ADR-039, 0242 close, this task's brief/plan) — the generator wrote
exactly one file, `claude/structure-manifest.tsv` (brief verification 6 satisfied).

## Red first (brief verification 5)

Test written and run before the generator existed. Captured output of
`node --test test/structure-manifest.test.js` (2026-08-07):

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
'/Users/mark.dolbyrev/Workspace/fkit/bin/generate-structure-manifest.mjs' imported from
/Users/mark.dolbyrev/Workspace/fkit/test/structure-manifest.test.js
...
ℹ tests 1
ℹ pass 0
ℹ fail 1
```

## Verification runs (2026-08-07)

- **Generator:** `npm run generate:manifest` → `wrote claude/structure-manifest.tsv — 63 entries`,
  0.29 s wall.
- **Spot-checks (brief verifications 1, 2, 3, 6):**
  - `ai-agents/README.md` carries **11** distinct hashes — blobs from the generic era
    (`db49851:generic/ai-agents/README.md`, pinned in test B) through the current scaffold. ≥ 2
    eras proven (verification 1).
  - Manifest path census: 17 project paths = the 16 current scaffold project files (excl.
    `.gitkeep`, `universal-rules.md`) + the historical-only `ai-agents/reviews/README.md` — the
    exact class-agnostic-superset shape the plan (open question 2, RULED) predicts.
  - CRLF fixture (test C) green: LF→CRLF variant of a shipped file matches; a content edit does
    not; a lone `\r` is content (verification 2).
  - Elision fixtures (test D) green: block-only drift matches; body drift and deleted markers do
    not; malformed pairs throw; the marker-less omnigent-era `CLAUDE.md`
    (`ebf87a6:omnigent/scaffold/CLAUDE.md`, verified 0 `fkit:` lines) whole-file-hashes to a
    manifest entry (verification 3).
  - Marker-recognition contract (test E) green: prose-quoted marker inert; CRLF marker line
    recognized; whitespace-padded recognized; marker-plus-trailing-prose inert.
- **New suite green:** 5/5 pass, ~0.2 s wall — well inside the plan's ~1 s budget that prove-red
  multiplies by ~16.
- **Staleness guard live-fired:** appended one byte to `claude/scaffold/ai-agents/README.md`
  without regenerating → test A red ("manifest is STALE"); reverted → 5/5 green again.
- **Determinism:** two `--stdout` runs byte-identical (`cmp`), and identical to the committed file.
- **Full `npm test` (incl. `test/prove-red.sh`):** see the result line at the end of this file.

## Decision log

Per ADR-019's audit obligation (transferred by ADR-032): fixes applied without asking and
obvious-winner calls made unattended, with why each qualified.

1. **Non-vacuity floor recalibrated 20 → 15** (in `test/structure-manifest.test.js`, assertion A's
   tail). My first-cut floor of 20 was a guess and fired on the honest table (17 real paths — the
   correct class-agnostic-superset census, verified by hand against the scaffold + history before
   touching the floor). Qualified as in-plan + mechanical/localized: the plan prescribes the test's
   assertions, not this incidental constant; the fix follows the repo's own calibrated-floor
   discipline (`dual-home-parity.test.js` REASON_FLOOR) and is commented as measured, not guessed.
2. **Obvious-winner: latin1 (byte-faithful) decoding for all content hashing** in the generator —
   sha256 over latin1-round-tripped bytes equals sha256 over the raw bytes, so arbitrary/invalid-
   UTF-8 content can never be mangled by decode/encode. Within the plan's intent (its hashing
   contract is byte-level); no behavioral alternative dominates it.
3. **Obvious-winner: unrecognized top-level `claude/scaffold/` entry → generator refuses loudly**
   (mirrors the plan's malformed-marker refusal rationale). Silently skipping could ship
   unmanifested content; silently including could manifest content that never installs
   (`universal-rules.md` is the live counterexample). Refusal forces the design decision to a
   human; within the plan's "fails loudly, never guesses" intent.

No other unattended fixes; nothing outside the approved plan was touched.

### Review Round 1 fixes (2026-08-07, Process-review worker under the sprint-loop standing approval)

Owner ruled via AskUserQuestion in the live lead session (relayed verbatim in `review.md`):
R1–R3 + R5 "Fix now"; R4 + R6 "Accept as residuals". Each fix below answers a `review.md` finding;
all four qualified as verified-CORRECT + mechanical/localized + in-plan **and** carried the explicit
owner ruling.

4. **R1 — pinned `-c log.showRoot=true`** on the history walk (`historicalBlobs()`,
   `bin/generate-structure-manifest.mjs`). Answers R1: a user config `log.showRoot=false` silently
   dropped the root commit's 15 raw entries (re-verified: 146 vs 131). Qualified: one-flag pin,
   inside the plan's "one `git log` pass" mechanics; verified post-fix under a hostile
   `GIT_CONFIG_*` env — committed bytes still produced.
5. **R2 — byte-safe raw parse + printable entry key.** Answers R2. `-z` on the log pass
   (NUL-separated records, literal path bytes — kills the quotePath silent-drop), parse rewritten
   over NUL tokens with a loud format guard; internal entry key changed NUL-separator →
   `hash\tpath` (hash first, fixed width). NOTE: half (b) of the finding was wrong as claimed — the
   old separator was a literal NUL byte in the source, not a space, so the key was already
   byte-safe; the tab key was applied per the ruling as strictly clearer (and removes raw NUL bytes
   from the source). Recorded as PARTIALLY CORRECT in the ledger with `cat -v` evidence.
6. **R3 — omnigent-era pin in test B** (`test/structure-manifest.test.js`): hoisted
   `OMNIGENT_ERA_COMMIT` (= `ebf87a6…`, the coordinate D already used inline), added the B
   assertion on `omnigent/scaffold/ai-agents/README.md`'s hash (blob `2213415…`, verified unique
   to that home). Proven to fire: a walk missing the omnigent prefix keeps 17 paths (all prior
   assertions green) but loses exactly this hash. Qualified: test-only, pins a plan-mandated
   property (B "multi-era", brief verification 1).
7. **R5 — refusal message teaches both halves**: the unrecognized-scaffold-entry error now names
   `workingTreeFiles()`'s KNOWN map AND `ROOT_FILES`/`WALK_PATHS` (+ `ELIDED_PATHS`), and states
   the silent-history-loss failure mode of teaching only one. Message-only change.

R4 + R6: **no fix — accepted residuals** per the owner's ruling, recorded in `review.md` with the
verbatim re-raise clause ("re-raise only if a symlink/FIFO or >100 MiB content ever enters the
scaffold"). No obvious-winner calls were made this round beyond the four ruled fixes.

**Post-fix verification:** targeted suite 5/5 green; full `npm test` incl. prove-red green
(606/606, hard gate passed); determinism `cmp` clean across two runs; **committed
`claude/structure-manifest.tsv` bytes UNCHANGED** by the fixes (reviewer's prediction confirmed on
this default-config machine — no regeneration needed).

## Out-of-scope guards honored

No commit/push; no wiki-vault write; no task-file move; no classification consumer; no
consuming-project write; no launch-path change; zero new devDependencies (node builtins only); no
prove-red mutation added (deliberate — plan §"The completeness test", last bullet; red-first shown
by build order instead).

## Full-suite result

`npm test` (unit suite + `test/prove-red.sh`), 2026-08-07: **GREEN, exit 0.**

```
ℹ tests 606
ℹ suites 17
ℹ pass 606
ℹ fail 0
...
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

Unit suite wall time 27.3 s with the new suite included; prove-red's 14 mutations all red their
named assertion and the 9 unmutated-copy baselines stay green — the new suite is seam-indifferent
under prove-red exactly as designed (brief verification 5 complete: red first, then full green).
