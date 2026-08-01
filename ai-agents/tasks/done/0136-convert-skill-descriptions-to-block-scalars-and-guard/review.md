# Review — 0136

Task: `ai-agents/tasks/backlog/0136-convert-skill-descriptions-to-block-scalars-and-guard/brief.md`
File(s) under review: `claude/skills/*/SKILL.md` (25, frontmatter line 3 only) · `test/skill-frontmatter.test.js` (new) · `test/prove-red.sh` (`run_frontmatter_suite()`, step `0g`, mutations 8–9) · the task's `plan.md` / `worklog.md`
Status: closed-out

**Final verdict: ✅ Ready to merge (validation-gated).** No open confirmed defect — all six Round 1
findings (R1–R6) were verified CORRECT and **all six fixed**. The gate is the one accepted residual:
the live-loader render is UNVERIFIED (brief verification step 5), which the owner ruled ship-anyway on
2026-08-01. Reviewers run: reviewer pass + Codex adversarial pass (codex-cli 0.145.0) — **both ran;
coverage is COMPLETE, not degraded.** Task closed `✅ Done (agent-closed — not owner-verified)`.

**Verdict (Round 1): ⚠️ Changes requested — 4 defects (none blocking).** Reviewers run: reviewer pass +
Codex adversarial pass (codex-cli 0.145.0) — **both ran; coverage is complete, not degraded.**

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `test/skill-frontmatter.test.js:148` | Trailing whitespace on a continuation line silently changes the rendered description (`['  foo ','  bar']` folds to `"foo  bar"` — a DOUBLE space) and `auditFile()` returns no violation — but `plan.md:180` states it is "flagged by the reader". No live instance today; the promised check was never built. |
| R2 | 1     | low    | `test/skill-frontmatter.test.js:104` | The E5 blind-spot residual is justified as "inherent without a full YAML parser, which ADR-014 forbids". Overstated: the frontmatter vocabulary across all 32 files is a closed 5-key set (`name`×32, `description`×32, `color`×7, `initialPrompt`×7, `tools`×1), so a key allowlist would close it with zero devDeps. Frontier-move — but recorded as "inherent" the residual becomes permanently unrevisitable. |
| R3 | 1     | low    | `test/skill-frontmatter.test.js:88` | A second `description:` key defeats the structural rule entirely: `findKey()` returns only the first match and the duplicate is itself a valid `KEY_LINE`, so `auditFile()` returns `[]` while a real YAML loader takes the LAST duplicate and renders a plain scalar. Verified: returns `[]`. (Codex-raised.) |
| R4 | 1     | low    | `test/skill-frontmatter.test.js:115` | `foldBlockScalar()` diverges from real `>-` semantics when a blank line precedes a more-indented line: returns `"one\n  two"` where YAML yields `"one\n\n  two"`. No live impact (E7 rejects any `\n`), but the function is directly asserted as a `>-` implementation at line 379 and is this task's own conversion oracle. (Codex-raised.) |
| R5 | 1     | low    | `test/prove-red.sh:20` | Header still reads "Two mutations, each caught by a NAMED assertion" and lists only 1–2; there are now **nine**, two added by this task 17 lines below it. Coder declared this as a pre-existing residual (honest) — but 0136 worsened the drift, in the one file whose entire thesis is that an unexercised gate hides drift, and whose own history includes mutation 1 sitting silently disarmed for a whole task. |
| R6 | 1     | low    | `test/skill-frontmatter.test.js:431` | Non-vacuity is `files.length > 0`, so a **partially** missing corpus passes — 24 of 25 skills could vanish and the guard stays green. Verified nothing else reconciles the inventory with disk (`ALL_SKILLS` in `skill-ownership-hook.test.js` is a hardcoded list, no `readdir`). Frontier-move: a hard count of 25 churns on every skill added. Out of 0136's approved scope. (Codex-raised.) |

### Verified as claimed — no finding

Independently re-derived, not taken from the coder's evidence:

- **The load-bearing regression check is CONFIRMED, three ways.** All 25 rendered descriptions are
  byte-identical before→after. Re-derived with my own spec-written folding reader in **Python** (a
  different language from the code under test, so no shared-bug false negative), and independently
  again by Codex with its own reader. The coder's `foldBlockScalar()` was not used as its own oracle.
- **Loader-listing claim is correctly scoped.** The coder states plainly that byte-identity with the
  injected listing validates the *before* side only and "does not prove the loader renders the *new*
  file the same way; that is residual 1". Accurate.
- **Mutations 8 and 9 are genuinely armed — the highest-value check, and it passes.** Both apply a real
  change (8: `fkit-team` → plain scalar; 9: de-indents the *second* content line of
  `fkit-sprint-ship-loop`, verified by tracing the `infold`/`n` counter). Both `cmp -s` no-op guards were
  tested by deliberately disarming them: breaking mutation 8's awk pattern → `cmp -s` detects the no-op;
  simulating a future rewrap to a single continuation line → mutation 9's guard detects the no-op. Both
  set `fail=1`.
- **`0g` is real.** `make_claude_copy` echoes `$dst/fkit-claude.sh`, so `dirname "$clean_copy"` resolves
  to the copied `claude/` root. Green on an unmutated copy, so reds 8/9 are not red-via-setup.
- **Diff is frontmatter-only.** All 25 hunks at line 3 (`@@ -3 +3,N @@`, plus `-3,2 +3,3` for
  `fkit-sprint-ship-loop`); 120 insertions / 26 deletions. Codex independently confirmed all 25 bodies
  byte-identical to `HEAD`.
- **Hygiene:** zero plain scalars remain; zero trailing whitespace; zero tabs; uniform 2-space indent;
  no CRLF; no BOM. (Verified directly — but see **R1**: verified is not the same as *guarded*.)
- **`npm test`: 544 pass / 0 fail, 17 suites. `prove-red.sh`: `0a`–`0g` green, mutations 1–9 each red at
  their named assertion.** Re-run by me, not taken on report.
- **ADR-014 honored** — `package.json` has no `devDependencies`; no YAML library added.
- **Agents untouched** — `git diff --stat claude/agents/` empty; 7/7 already `>-` and passing.
- **Mirrors** — `diff -r` clean for both `claude/skills` and `claude/agents`; `.claude/skills/fkit-*/`
  and `.claude/agents/fkit-*.md` are gitignored.
- **`awk` instead of `sed` (declared departure from the plan's letter) — accepted.** The plan's substance
  was that the mutation actually applies and is guarded against silently becoming a no-op. `awk` delivers
  both, and mutation 8's two-line join genuinely is not portable in `sed`.
- **Residuals 1 and 3 are honestly scoped** — the live-loader eyeball is reported UNVERIFIED (owner
  ruled ship-anyway), and frontmatter-only coverage is stated in the test header and the brief.

**One claim NOT independently re-verified:** the `0a` baseline of **523 pass**. Re-checking it would mean
reverting the working tree, which a review must not do. It is arithmetically consistent — I counted
exactly 21 `test(` calls in the new suite, and 523 + 21 = 544 observed. Recorded as asserted, not proven.

## Re-litigates settled decisions (suppressed)

- **`FKIT_FRONTMATTER_ROOT` warns on stderr but nothing fails if the root is wrong** (Codex, medium).
  Suppressed: `test/harness.mjs:22-28` does exactly this for `FKIT_LAUNCHER`, the established seam
  pattern this one is explicitly modelled on. Not a defect introduced by 0136. Re-raise only if the
  repo-wide seam pattern is revisited as its own task.
- **"Use a real YAML parser"** — settled by ADR-014 (zero devDeps). Primed out; no reviewer raised it.
- **"Collapse the descriptions back to one long line"** — settled by the owner (an unwrapped line makes
  the indentation assertion vacuous for 24 of 25 files). Primed out; no reviewer raised it.
- **"No test substitutes for the loader" / "skill bodies are untested"** — already documented residuals.

## Convergence call

**Act, don't close out.** This is Round 1 with no prior ledger, so nothing here is re-litigation. R1 is a
genuine plan-vs-implementation gap in the one guard whose stated thesis is "the rendered description must
not change", and it is cheap to close. R3–R5 are small and real. R2 and R6 are frontier-moves whose
disposition is the owner's, not defects to fix by default.

**Nothing here blocks the ship.** The conversion is proven byte-safe by three independent readers, the new
gate is proven genuinely armed, and the suite is green. The findings are about the *guard's* completeness,
not about a regression in the 25 files.

## Coder response

_(coder-owned — reviewer does not write here)_

**Round 1 — all six verified against the code, all six CORRECT, all six fixed.** The owner ruled on
every disposition (2026-08-01) and approved this round's scope; R2 and R6 are frontier-moves adopted on
that ruling, not defects I closed on my own authority.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (plan-vs-implementation gap) | New clause **E8** — any continuation line with trailing whitespace — plus 2 unit fixtures. `plan.md:180`'s "flagged by the reader" is now true. | fixed |
| R2 | CORRECT | Frontier-move (owner-adopted) | `KNOWN_KEYS` closed allowlist replaces the "any column-0 `word:`" heuristic; E5 now accepts only those five as a scalar terminator. Residual rewritten — no longer "inherent". | fixed |
| R3 | CORRECT | Defect | New clause **E9** — a key declared twice — plus 2 unit fixtures. Runs *before* the E4 early return so it survives it. | fixed |
| R4 | CORRECT | Defect (oracle correctness) | `foldBlockScalar()` rewritten to carry a blank-run count; blanks adjacent to a more-indented line now yield k+1 breaks. | fixed |
| R5 | CORRECT | Defect (doc drift) | Header now reads **NINE**, with a one-line index of all nine and their named assertions, and an explicit "keep this in step" warning. | fixed |
| R6 | CORRECT | Frontier-move (owner-adopted) | `EXPECTED_SKILLS = 25` / `EXPECTED_AGENTS = 7` exact pins replace `length > 0`, with a failure message spelling out that the count is bumped **deliberately**, never to turn a run green. | fixed |

### How each was verified before it was acted on

Nothing here was taken from the reviewer's write-up; each claim was re-derived first.

- **R1.** `foldBlockScalar(['  foo ','  bar'])` → `"foo  bar"` (double space) and `auditFile()` returned
  `[]`. Confirmed against a real YAML loader (Ruby Psych): `"foo  bar"`. `plan.md:180` does promise the
  check. Claim true.
- **R2.** Re-counted the vocabulary myself across all 32 files: `name`×32, `description`×32, `color`×7,
  `initialPrompt`×7, `tools`×1 — nothing else. The reviewer's closed-set claim holds.
- **R3.** Reproduced: a second `description:` → `auditFile()` returns `[]`. Ruby Psych on the same
  frontmatter returns **the second, plain-scalar value** — so the reviewer's "a real loader takes the
  LAST duplicate" is confirmed by a real loader, not assumed.
- **R4.** Confirmed the exact divergence, then went further: enumerated **all 363** line-sequences of
  length ≤ 5 over {base, more-indented, blank} and diffed this function against Ruby Psych. 241 are
  legal YAML; the old code mismatched **49** of them, the new code mismatches **0**. Psych is a
  development-time oracle only — nothing was added to `package.json`.
- **R5.** `test/prove-red.sh:20` did read "Two mutations"; nine exist. True.
- **R6.** Confirmed `files.length > 0` and confirmed nothing else reconciles the inventory with disk.

### Non-vacuity of the new tests — they were green before

The three new fixtures were run against the **pre-fix** predicates: the duplicate-`description:`
fixture, the `note:`-de-indent fixture and the trailing-space fixture were **all silently clean** under
the old reader (no E4, no E5, no trailing-whitespace clause existed). The R6 pin was armed the same way
— a copied tree with one skill directory removed now reds naming the deliberate-update rule, where
`24 > 0` was green.

### Mutations 8 and 9 re-verified at the *violation*, not just the test name

I edited the very reader those mutations exercise, and both fire inside the **same** named test as the
new count pin — so a matching grep alone would not have distinguished a real red from a red-for-the-
wrong-reason. Replaying both mutations by hand and reading the assertion text: mutation 8 reds at
**E4** (`fkit-team` plain scalar), mutation 9 reds at **E5** (`fkit-sprint-ship-loop` de-indent), each
reporting "**1 of 25** skill files" — which also proves the count assertion *passed* rather than being
what failed.

### Two things recorded rather than quietly absorbed

1. **A new, precisely-scoped limit in `foldBlockScalar()`.** A whitespace-only line indented *deeper*
   than base is a more-indented content line to YAML (`['  foo','   ','  bar']` → `"foo\n \nbar"`); this
   function still treats every whitespace-only line as blank (`"foo\nbar"`). It is **not reachable
   undetected** — E8 rejects any such line by definition — and it is documented at the function rather
   than fixed, so the "matches `>-`" claim is not made broader than the 241 cases actually tested.
   Fixing it was outside the R4 ruling, so it was not done. **Not yet an accepted residual — it is the
   owner's call whether to close it or record it.**
2. **The allowlist has a cost, and the message carries it.** A legitimately-added sixth key now reds E5.
   That is unavoidable once the set is closed, so the E5 message names *both* causes — a lost indent
   **or** a new key needing `KNOWN_KEYS` updated in the same change — rather than only the first.

### Not re-opened

The suppressed `FKIT_FRONTMATTER_ROOT` stderr-warning finding was left alone: `harness.mjs:22-28` is the
established seam pattern and it is not a 0136 defect.

## Accepted residuals (shared, do-not-re-litigate)

- **Live-loader render is UNVERIFIED** — What: ship 0136 with brief verification step 5 (eyeballing the
  live Claude Code skill listing) outstanding, reported as unverified rather than blocked on. · Why
  (structural): no test in this repo can substitute for Claude Code's own parser; the owner ruled
  ship-anyway on Round 0. The before-side is loader-validated; the after-side is not. · Re-raise only if:
  a description's listing text is observed to have changed, or a loader-driven check becomes available.
- **E5's remaining blind spot — NARROWED by R2, and explicitly NOT inherent** _(added by the coder on
  the owner's R2 ruling; supersedes the earlier "inherent without a YAML parser" wording, which the
  reviewer showed was overstated and which would have made this permanently unrevisitable)_ — What: a
  de-indented continuation line beginning with one of the five known keys (`name:` `description:`
  `color:` `initialPrompt:` `tools:`) is still indistinguishable from that key being declared, so E5
  does not catch it. Before R2 the check accepted **any** well-formed `word:` line, so a line beginning
  `note: …` slipped through too; the allowlist closed that far larger part. · Why (policy, **not**
  structural): a real YAML parser would close the remainder outright. What rules that out is ADR-014's
  zero-devDeps policy — a deliberate choice, not a property of the problem. · Re-raise only if: ADR-014
  is revisited, or a live file is found whose de-indented line begins with one of the five keys.
- **Guard reads frontmatter only; skill BODIES are untested** — What: `test/skill-frontmatter.test.js`
  asserts nothing about a skill's procedure. · Why (structural): out of this task's scope; body coverage
  is a separate, much larger problem. · Re-raise only if: a green run here is cited as evidence of skill
  *behaviour*.
- **No YAML library (ADR-014 zero devDeps)** — What: the frontmatter reader is hand-rolled. · Why
  (structural): ADR-014; block scalars are what make hand-rolling tractable, which is why the conversion
  came first. Rejected: js-yaml and every other parser dependency. · Re-raise only if: the hand-rolled
  reader is shown to mis-render one of the actual 25 descriptions.
- **`foldBlockScalar()` treats every whitespace-only line as blank** _(NEWLY ACCEPTED by the owner
  2026-08-01, on the coder's "recorded rather than quietly absorbed" item 1 — it was explicitly not yet
  a residual at the end of Round 1; it is one now)_ — What: YAML treats a whitespace-only line indented
  *deeper* than base as more-indented **content** (`['  foo','   ','  bar']` → `"foo\n \nbar"`); this
  function still folds it as a blank (`"foo\nbar"`). Documented at the function rather than fixed, so the
  "matches `>-`" claim is not made broader than the 241 sequences actually tested. · Why (structural,
  bounded): **not reachable undetected** — clause `E8` rejects any continuation line carrying trailing
  whitespace by definition, so no live file can hit the divergence without first failing the guard;
  fixing it was outside the owner's R4 ruling. · Re-raise only if: `E8` is weakened or removed, or a
  caller uses `foldBlockScalar()` on input that has not passed `E8`.
- **The `KNOWN_KEYS` allowlist has a churn cost, deliberately paid** — What: a legitimately-added sixth
  frontmatter key reds `E5` until `KNOWN_KEYS` is updated in the same change. · Why (structural):
  unavoidable once the key set is closed — that closure is exactly what bought the R2 narrowing; the
  `E5` failure message therefore names **both** causes (a lost indent **or** a new key needing
  `KNOWN_KEYS` updated), rather than only the first. Rejected: reverting to the open "any column-0
  `word:`" heuristic. · Re-raise only if: the message is observed to mislead someone adding a key, or
  the frontmatter vocabulary stops being a closed set.
- **The `0a` baseline of 523 pass was ASSERTED, not proven** — What: the pre-change pass count that
  `523 + 21 + 7 = 551` is reconciled against was taken from the coder's report, not independently
  re-run. · Why (structural): re-checking it means reverting the working tree, which a review must not
  do; it is arithmetically consistent with the observed totals and with the counted new `test(` calls. ·
  Re-raise only if: the arithmetic stops reconciling on a later run, or a clean-tree baseline is
  captured for another reason.

## Close-out

Recorded 2026-08-01. **One round, no Round 2.** All six findings verified CORRECT, all six fixed, all
on the owner's ruling of the same date. No open confirmed defect remains.

### Per-finding disposition

| #  | Verified | Disposition |
|----|----------|-------------|
| R1 | CORRECT  | **Fixed** — new clause `E8`: any continuation line carrying trailing whitespace is a violation. Closes the `plan.md:180` "flagged by the reader" gap. |
| R2 | CORRECT  | **Fixed together with R3** — adopted the closed 5-key `KNOWN_KEYS` allowlist (`name`, `description`, `color`, `initialPrompt`, `tools`) in place of the open "any column-0 `word:`" heuristic. Frontier-move, owner-adopted. |
| R3 | CORRECT  | **Fixed together with R2** — duplicate-key rejection as clause `E9`, running *before* the `E4` early return so it survives it. |
| R4 | CORRECT  | **Fixed** — `foldBlockScalar()` rewritten to carry a blank-run count, so a blank line before a more-indented line yields k+1 breaks. |
| R5 | CORRECT  | **Fixed** — `prove-red.sh` header corrected from "Two mutations" to **nine**, with a one-line index of all nine and their named assertions. |
| R6 | CORRECT  | **Fixed** — `length > 0` replaced by exact count pins `EXPECTED_SKILLS = 25` / `EXPECTED_AGENTS = 7`. Frontier-move, owner-adopted. |

### Final verification

- **`npm test`: 551 pass / 0 fail across 17 suites** (523 baseline + 21 + 7). The 523 baseline is
  asserted, not proven — see the residual above.
- **`prove-red.sh`: `0a`–`0g` green, mutations 1–9 each red, `✓ hard gate PASSED`.**
- **Mutations 8 and 9 re-checked at their *violation*, not merely at the test name** — mutation 8 reds
  at `E4`, mutation 9 at `E5`. Necessary because both fire inside the **same** named test as the new
  count pin, so a matching grep alone could not tell a real red from a red-for-the-wrong-reason. Each
  reported "1 of 25 skill files", which also proves the count assertion *passed* rather than being what
  failed.
- **New fixtures confirmed non-vacuous** — the duplicate-key, `note:`-de-indent and trailing-space
  fixtures were all **silently clean under the pre-fix reader**. The R6 pin was armed the same way: a
  copied tree with one skill directory removed now reds, where `24 > 0` was green.

### R4 was verified against a real YAML parser, not against itself

All **363** line-sequences of length ≤ 5 over {base, more-indented, blank} were diffed against Ruby's
Psych: **241 legal**, the **old code mismatched 49**, the **new code mismatches 0**. Psych was a
development-time oracle on the box only — `package.json` still carries **no `devDependencies`**;
**ADR-014 is intact**.

### Codex coverage was COMPLETE, not degraded

Stated explicitly so the sprint roll-up's claim is checkable from this ledger: **`codex-cli 0.145.0`
ran to completion** in Round 1, returning **5 findings plus explicit no-finding statements on 6 attack
categories**. No reviewer was skipped; no partial-coverage flag applies to this review.

### Suppressed as settled — kept recorded

- **`FKIT_FRONTMATTER_ROOT` is stderr-warning-only** (Codex, medium). Suppressed: matches the
  established `FKIT_LAUNCHER` precedent at `test/harness.mjs:22-28`, the seam pattern this one is
  explicitly modelled on. Not a defect introduced by 0136. Re-raise only if the repo-wide seam pattern
  is revisited as its own task.

### Known-stale, deliberately NOT repaired

This ledger's line-3 self-header still points at `ai-agents/tasks/backlog/0136-…/brief.md`, a path this
close killed by moving the folder to `done/`. **Left as-is on purpose.** Task **0168** (open, P147)
normalizes all 40 such headers to folder-ID form per **ADR-034 §4.6**; writing a `done/` path here would
ship the very form §4.6 rules out. **This ledger joins 0168's population.**
