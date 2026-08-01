# Review — 0133

Task: `ai-agents/tasks/backlog/0133-build-dual-home-parity-test/brief.md`
File(s) under review: `test/dual-home-parity.test.js` (new), `test/prove-red.sh` (step `0h`, mutations
10–13, header index `NINE`→`THIRTEEN`), `ai-agents/knowledge-base/conventions/dual-home-parity.md`
(the three "not yet built" retirements only), plus the task's `plan.md` / `worklog.md`.
Out of scope: 0130 · 0136 · 0174 · 0132 (incl. `test/dual-home-parity-exceptions.mjs`,
`conventions/dependency-declaration-form.md`, and the bulk of `dual-home-parity.md`'s diff),
`ai-agents/sprints/sprint-2.md`, the 0133 brief status flip, the 0132/0174 folder moves, briefs 0177–0186.
Status: in-review

**Round 1 verdict: ⚠️ Changes requested — 6 defects (none blocking).** Reviewers run: **both**
(reviewer pass + Codex adversarial pass, `codex-cli 0.145.0`, exit 0). **Coverage is FULL — not degraded.**

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `test/dual-home-parity.test.js:413` | The tripwire's failure message prescribes a remedy that cannot work. `collectAll` (`:156-173`) never consults `findException`, so "give it its own exception entry (with a reason)" does not silence a hit. Proven with a **real** list entry: `tasks/backlog/.fkit` (kind `runtime-state`, its own exact exception) fires the tripwire when co-present under the `tasks/backlog/` prune point. Structural half: there is no way to put a co-present file under a blanket **onto** the enforced set — only "move it out" works — although 0132's hand-off says such a file "belongs on the enforced set". Raised by both reviewers. |
| R2 | 1 | medium | `test/prove-red.sh:526` | Mutation 13 has **no post-condition guard**. `cp … 2>/dev/null \|\| :` silently swallows a failed copy; the pre-check at `:519` only inspects the **repo**, never the mutant copy. Reproduced: with the destination directory absent from the scaffold copy the gate prints *"the suite did NOT catch a dual-homed file hiding under a blanket directory exception — 0132's hand-off tripwire is not load-bearing"* — a false accusation against `dual-home-parity.test.js` when nothing was mutated. Realistic trigger: removing `claude/scaffold/ai-agents/knowledge-base/reports/.gitkeep` makes git drop the directory. Mutations 1/3/4/5/6/7/8/9/12 all carry a `cmp -s` post-condition; 13 is the only one whose write can fail silently. |
| R3 | 1 | low | `test/dual-home-parity.test.js:138` | A **symlinked** excepted directory escapes **both** controls, silently green. `readdirSync(…,{withFileTypes:true})` reports a symlink-to-directory with `isDirectory() === false`, so `findException` matches, the entry is skipped, and `prunePoints` is never populated — the tripwire then never inspects it. Reproduced: with `knowledge-base/reports` a symlink in both homes, a co-present `reports/README.md` is neither enforced nor tripwired and the suite passes. This is the silent-miss direction. Mitigant: **zero symlinks exist in either home today**. |
| R4 | 1 | low | `test/dual-home-parity.test.js:129-132` | `readdirSync` failure is swallowed at **every** depth, not just the root. The docstring justifies the `catch` for a missing **root** only — and the root case is genuinely safe (verified: bogus scaffold root → every live file reads as missing → red; both roots missing → non-vacuity fires). Mid-tree it is not: if the same subdirectory is unreadable in **both** homes its dual-homed files vanish from the enforced set, the other files keep the set non-empty, and the suite is falsely green. |
| R5 | 1 | low | `test/prove-red.sh:491-497` | Mutation 12's `cmp -s` no-op guard does not fire when **both** the `.orig` copy and the append fail (`2>/dev/null \|\| :` on each). With `.orig` absent, `cmp` exits non-zero as an *error*, not as "equal", so the `if` is false. Reproduced: the gate reports *"red for the wrong reason"* instead of *"MUTATION WAS A NO-OP"*. The gate still fails (exit 1), so this is a diagnosis defect, not a false green. |
| R6 | 1 | low | `test/dual-home-parity.test.js:293-295` | `firstDifference` reports the wrong column when the first differing **byte** falls inside a multibyte UTF-8 sequence. `a.subarray(0,i).toString('utf8')` decodes a partial sequence into `U+FFFD`, inflating the prefix length by one. Reproduced: `aé` vs `aê` → reports column 3; the correct character column is 2. Cosmetic — both rendered lines are correct, so the reader is not misled about *what* differs. Reachable on the real corpus (`—`, `⚠️`, `✅` all appear in the dual-homed markdown). |
| R7 | 1 | low | `ai-agents/knowledge-base/conventions/dual-home-parity.md` ("Where this is enforced") | The retired-statement rewrite describes the tripwire in the **narrow** wording the test deliberately generalized away from — *"no blanket **directory exception** may hide…"*. The implementation keys on **prune points**, which also covers exact entries naming directories on disk (`wiki-vault/.fkit`, `tasks/backlog/.fkit` — both real). A maintainer reading only the convention could "simplify" the test back to the narrow form, which is the exact risk the test's own header (`:54-59`) warns about. |

## Coder response

_(coder-owned — the reviewer does not write this section)_

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | | | | |
| R2 | | | | |
| R3 | | | | |
| R4 | | | | |
| R5 | | | | |
| R6 | | | | |
| R7 | | | | |

## Re-litigates settled decisions (suppressed)

**None.** Neither reviewer re-raised any of the four owner rulings of 2026-08-01 (prune the walk ·
tripwire on prune points · 30-char `reason` floor with `kind` non-empty only · 0112 NOT APPLICABLE),
nor the plan's three rejected alternatives, nor ADR-014's zero-devDependencies rule.

## Independently verified — do not re-chase

Every claim below was re-derived by the reviewer without relying on the coder's evidence.

- **Enforced set is genuinely DERIVED, and brief step 6 is met because the tree is clean.**
  Re-derived by an independent union walk: exactly four files, byte sizes reproduce exactly —
  `knowledge-base/conventions/priority-is-rank-not-identity.md` (4389 B),
  `knowledge-base/conventions/task-owner-vocabulary.md` (3227 B), `tasks/README.md` (5611 B),
  `wiki-vault/schema.md` (3608 B) — all four present in both homes and byte-identical.
- **Pruning's cost, measured.** Pruned walk vs. descend-everywhere-then-filter-per-file differ by
  exactly **one** path (`wiki-vault/.fkit/state/askuq-…`), which is **live-only** — so the co-present
  class that pruning gives up is **empty today**. 11 prune points; 9 co-present `.gitkeep` files under
  them, matching the carve-out's stated justification.
- **All four no-op guards fire.** Each of mutations 10–13 was disarmed in a trimmed scratch copy; each
  shouts `MUTATION WAS A NO-OP`, and the gate exits 1. Guard 12's disclosed near-miss (a renamed target
  turning the append into a scaffold-only-file mutation) is genuinely closed by the existence check.
- **Each mutation reds at the RIGHT assertion.** Grep fragments are unique within the file the suite
  actually runs. `byte-identical` also appears in `test/orphan-cleanup.test.js:103`, but
  `run_parity_suite()` runs **only** `test/dual-home-parity.test.js`, so there is no collision.
- **`0h` is real** — the unmutated scaffold copy is green, so the reds below it isolate to the mutation.
- **The seam.** `LIVE_HOME` is `join(REPO,'ai-agents')` with no env var anywhere — the live tree cannot
  be redirected. The stderr warning fires on a non-default root and is silent on the default; a bogus
  root makes the suite **red**, never green.
- **The 30-char floor's measurement is correct.** 26 entries; shortest `reason` is **84** characters
  (`wiki-vault/.fkit`), longest 732. Headroom is ~2.8×, as corrected — not 3×.
- **Failure-message quality (brief step 4).** Rendered messages read well: the drift report names path,
  line, column, both clipped lines and both sizes; the truncation case is handled. Both
  `describeMissing` directions are now factually correct. `assert.ok` over `assert.deepEqual` is the
  right call. The one message defect found is R1.
- **ADR-014.** `package.json` unchanged, no `devDependencies`, no `dependencies`, no `node_modules`.
- **`npm test` reproduces exactly:** 559 tests / 17 suites / 559 pass / 0 fail, then
  `✓ hard gate PASSED`, exit 0 (551 baseline + 8 new tests).
- **The third retired "not yet built" statement is in-plan.** *"Until the test exists, this convention
  is enforced by reading it"* became false the moment the test landed; the plan's deliverable 3 says
  "retire the now-false statements", unqualified. Leaving it would have left an actively false claim.
- **`reviews/README.md` is not asserted on** anywhere — it exists in neither home and is absent from the
  derived enforced set.
- **Checked and acceptable, not raised:** a path that is a directory in one home and a file in the other
  produces two confusing-but-correct rows; a symlink in an **enforced** area reads as a file and fails
  loudly (safe direction); mutation 11's write failure aborts the script under `set -e` (loud, no false
  green); `describeMissing`'s scaffold-only remedy is correct for an enforced path; mutation 12's
  `.orig` scratch file is removed before the suite runs.

## The 0112 report — assessed

**The coder's NOT APPLICABLE is correct, and the report is honest.** The intersection table was
re-verified row by row:

| 0112 write surface | Under a parity home? | On the enforced set? |
|---|---|---|
| `claude/skills-for-role.sh` | no | no |
| `claude/skills/fkit-team/SKILL.md` | no | no |
| `claude/README.md` | no (distinct from the excepted `ai-agents/README.md`) | no |
| `claude/scaffold/CLAUDE.md` | no (one level **above** `claude/scaffold/ai-agents/`) | no |
| `ai-agents/knowledge-base/architecture.md` | **yes** | **no** — exact `live-only` exception, and the scaffold ships no `knowledge-base/architecture.md` at all (directory listing confirms) |

Intersection is **empty**. Reporting "pass" would indeed have laundered an unrunnable step. The
coder's statement that this **does not retire the owner's accepted risk on 0112** is correct and
important: 0112's surface lives in `claude/`, so it will *never* intersect the parity surface — the
owner's "re-verify by hand once 0133 lands" ruling cannot be discharged by this mechanism at all.
That is an open item for the producer, not a defect in this task.

**Substitute check: PASS 5/5 confirmed independently** (`lead` ↔ `sprint-ship-loop` across the source
of truth and its four mirrors). **The disclosed self-correction is correct:**
`ai-agents/knowledge-base/architecture.md:144` reads `| lead | \`sprint-ship-loop\` … |` — §4.2's table
drops the `fkit-` prefix uniformly, so a `fkit-sprint-ship-loop` pattern would have produced a **false
FAIL**. Both hits sit on `lead` lines, as claimed.

## Convergence call

Round 1, no prior rounds — nothing to converge from and nothing re-litigated. **Act, do not close out.**
Two mediums (R1, R2) are worth fixing; both are single-line-scale and neither affects today's green.
R3–R6 are low-severity residual hazards that may reasonably be recorded rather than fixed. R7 is a
one-sentence doc correction.

## Accepted residuals (shared, do-not-re-litigate)

_(none recorded yet — pending the owner's dispositions on R3–R6)_
