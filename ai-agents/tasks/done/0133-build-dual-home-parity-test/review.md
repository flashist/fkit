# Review — 0133

Task: 0133 — [brief](./brief.md)
File(s) under review: `test/dual-home-parity.test.js` (new), `test/prove-red.sh` (step `0h`, mutations
10–13, header index `NINE`→`THIRTEEN`), `ai-agents/knowledge-base/conventions/dual-home-parity.md`
(the three "not yet built" retirements only), plus the task's `plan.md` / `worklog.md`.
Out of scope: 0130 · 0136 · 0174 · 0132 (incl. `test/dual-home-parity-exceptions.mjs`,
`conventions/dependency-declaration-form.md`, and the bulk of `dual-home-parity.md`'s diff),
`ai-agents/sprints/sprint-2.md`, the 0133 brief status flip, the 0132/0174 folder moves, briefs 0177–0186.
Status: **CLOSED — 2026-08-02.** Two rounds, eleven findings, all dispositioned. **Final verdict:
✅ approved.** Round 2's four findings are dispositioned per the owner's rulings of 2026-08-02 —
**R8 · R9 · R10 fixed, R11 accepted as a residual.** No round 3: the reviewer's own convergence call
("do not re-review after these land — they are additive and independently checkable") and the owner
agreed. Accepted residuals carried forward: **R3 · R4 · R6 · R11**, plus the **0112 NOT-APPLICABLE**
report, which is an open **producer** item, not a finding against this task.

**Round 1 verdict: ⚠️ Changes requested — 6 defects (none blocking).** Reviewers run: **both**
(reviewer pass + Codex adversarial pass, `codex-cli 0.145.0`, exit 0). **Coverage is FULL — not degraded.**

**Round 2 verdict: ⚠️ Changes requested — 4 defects (none blocking).** Scope: the R1/R2/R5/R7 fix diff
only. Reviewers run: **both** (reviewer pass + Codex adversarial pass, `codex-cli 0.145.0`, exit 0).
**Coverage is FULL — not degraded.** See *Round 2 — reviewer report* below.

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
| R8 | 2 | low | `test/dual-home-parity.test.js:643` | **The promotion's byte-comparison is not pinned by any assertion** — the same species of defect R1 was (a message promising what nothing proves). The rewritten tripwire message (`:476-477`) states *"the two copies were compared above"*. The behavior is correct (verified: a promoted differing pair does land in `r.differing`), but **no test asserts it**. The new promotion fixture (`:602`) uses two IDENTICAL copies, so `r.differing === []` passes whether or not a promoted path is ever compared; test 8's fixture (`wiki-vault/.fkit/session-state`, `'live\n'` vs `'scaffold\n'`) is already the right shape and asserts **only** `r.hidden`. Adding `if (promoted.has(p)) continue;` to the comparison loop would keep all nine tests green while silently voiding the promotion's whole purpose. The pin is one assertion on the fixture that already exists. Raised by Codex; verified independently. |
| R9 | 2 | low | `ai-agents/knowledge-base/conventions/dual-home-parity.md:118` | **The R7 rewrite's new example is factually wrong about the real tree.** It names `tasks/backlog/.fkit` as a prune point "named exactly". It is not one: the walk hits the covering `tasks/backlog/` directory entry first and prunes there, so `.fkit` is never reached. Measured — live prune points are `.fkit · knowledge-base/{decisions,history,incidents,reports} · sprints · tasks/{backlog,cancelled,done} · wiki-vault/.fkit · wiki-vault/wiki`; `tasks/backlog/.fkit` is absent, `wiki-vault/.fkit` is the only exact-entry prune point. In this fix `tasks/backlog/.fkit` plays the **opposite** role — the entry strictly BENEATH a prune point that EXCUSES (test 7 pins exactly that) — so the sentence teaches the mechanism backwards. Adjacent, NOT raised (round-1 cleared, pre-existing): `test/dual-home-parity.test.js:57` carries the same wrong example; fix both or neither. Raised by Codex; verified independently. |
| R10 | 2 | low | `test/dual-home-parity.test.js:69` | **The new header rule-2 text names the mechanism the implementation deliberately does not use**, contradicting the function's own docstring 130 lines below. Header: *"a hit is excused when `findException` resolves it to an entry STRICTLY BENEATH the prune point"*. `excusedBeneath` (`:230-241`) scans `exceptions` directly and never calls `findException` — and `:201-207` says so explicitly, *on purpose*, because `findException`'s most-specific-wins rule is array-ordered between two directory entries. A maintainer reading only the header would "simplify" `excusedBeneath` into a `findException` call and reintroduce the exact array-order dependence the coder recorded as a judgment call. Same risk shape as R7. One-sentence correction. |
| R11 | 2 | low | `test/prove-red.sh:549-550` | **R2's false accusation is still printed, after the new guard rather than instead of it.** The new post-condition (`:540`) sets `fail=1` but does not skip the mutation's run/verdict block, so a disarmed mutation 13 prints the no-op diagnosis AND then *"the suite did NOT catch a dual-homed file hiding under a blanket directory exception — 0132's hand-off tripwire is not load-bearing"* about a working test. Reproduced (`rm -rf "$m13/knowledge-base/reports"` before the `cp`). **Substantially mitigated, and I rate this LOW where Codex rated it medium:** the diagnosis prints FIRST and ends *"the result below proves nothing about the tripwire"*, the gate exits 1, and all 13 mutations share this annotate-don't-abort shape (mutation 12 behaves identically — see `:497`). Skipping the block is not the one-line class the owner authorized and would fork the file's uniform convention. Leans **frontier-move**; recorded so it is not silently dropped. Raised by Codex. |

## Coder response

_(coder-owned — the reviewer does not write this section)_

**Round 1, all seven dispositioned. Four fixed (R1 · R2 · R5 · R7), three accepted as residuals
(R3 · R4 · R6) per the owner's rulings of 2026-08-01.** Every finding was re-verified against the code
before acting — all seven reproduce exactly as written; none was applied on the reviewer's word alone.
Severity assigned independently: it agrees with the reviewer's on all seven.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | Tripwire now consults the exception list (`excusedBeneath`, `dual-home-parity.test.js:186-212`) — a hit is excused by an entry STRICTLY BENEATH the prune point, so "give it its own exception entry" is now true. Structural half: a hit that is NOT excused is added to the enforced set (`:281-289`), so a file under a blanket reaches parity enforcement without being physically moved. Message rewritten to name only remedies the code honors. Two new synthetic tests. | ✅ done |
| R2 | CORRECT | Defect | Added the post-condition guard the other nine mutations carry — `cmp -s` between the repo file and the MUTANT COPY after the `cp` (`prove-red.sh:527-540`). A swallowed copy now prints `MUTATION WAS A NO-OP` instead of accusing a working test. | ✅ done |
| R3 | CORRECT | Frontier (owner-accepted residual) | None. Recorded below with a re-raise condition. Re-verified: zero symlinks in either home today (`find -type l` = 0), so the escape is latent, and the failure direction is silent-green. | won't fix (frontier) |
| R4 | CORRECT | Frontier (owner-accepted residual) | None. Recorded below with a re-raise condition. Re-verified: the `catch` at `:129-133` is inside `descend`, so it applies at every depth; the docstring justifies only the root case. | won't fix (frontier) |
| R5 | CORRECT | Defect (diagnosis quality) | `.orig` existence added to mutation 12's no-op guard (`prove-red.sh:497-506`). Reproduced first: with `.orig` absent `cmp -s` exits **2** (error), so the bare `cmp` fell through to "red for the wrong reason". | ✅ done |
| R6 | CORRECT | Defect (cosmetic) — owner-accepted residual, NOT a tradeoff | None. Reproduced: `aé` vs `aê` reports column 3, correct is 2. Recorded below with a re-raise condition. Recorded as a residual because the owner ruled it accepted, not because it is a defensible design point. | won't fix (frontier) |
| R7 | CORRECT | Defect (doc) | `conventions/dual-home-parity.md` "Where this is enforced" now describes the tripwire on **prune points**, names both spellings, and states the enforced-set promotion from R1. | ✅ done |

**Disclosed: one regression I introduced and caught inside this round.** The first cut of R1's promotion
put the hit on the enforced set but tested presence against the two **walk** sets — which by
construction do not contain a pruned path. Mutation 13 then reported `knowledge-base/reports/README.md`
as *"present in claude/scaffold/ai-agents/, MISSING from ai-agents/"* about a file sitting in **both**
homes, and reded two assertions instead of one. Found by **running** mutation 13 against the change,
not by reading it. Fixed at `:284-291` (a `promoted` set counts as present in both) and pinned by a new
assertion in the `.gitkeep` fixture. A second self-caught bug: `excusedBeneath` first matched the prune
point's **own** entry (`knowledge-base/reports/` starts with `knowledge-base/reports/`), which disarmed
the tripwire completely — both fixtures went empty and the new tests failed. Fixed by comparing the
entry without its trailing slash.

**One judgment call inside the approved scope, recorded rather than assumed.** The new message offers a
*directory* entry beneath the prune point as a remedy. `findException` guarantees most-specific-wins for
**exact-beats-directory** only; between two **directory** entries it returns whichever the array lists
first, so a nested directory entry could lose to the blanket above it and that remedy would depend on
array order. `excusedBeneath` therefore scans the list itself instead of calling `findException` — the
question it asks ("is there an entry BENEATH this prune point") is not the question `findException`
answers. Latent, not live: no directory entry is nested inside another today. The branch is unit-tested
against a real entry under a hypothetical prune point rather than left as an untested promise — which
is the species of defect R1 was.

### Round 2 — all four dispositioned (owner rulings, 2026-08-02)

**Three fixed (R8 · R9 · R10), one accepted as a residual (R11).** Every finding was re-verified
against the code before acting; none was applied on the reviewer's word alone. **All three verified
claims reproduce exactly as written.** Severity assigned independently: it agrees with the reviewer's
on all four — including R11, where I agree with the reviewer's **LOW** over Codex's **medium**, for the
reasons recorded in the residual below.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R8 | CORRECT | Defect | **Reproduced first, exactly as the reviewer predicted:** adding `if (promoted.has(p)) continue;` to `compareHomes`'s comparison loop left **all nine tests green**, so the tripwire message's *"the two copies were compared above"* was pinned by nothing. Fixed by asserting on the fixture that already had the right shape — test 9's `wiki-vault/.fkit/session-state` (`'live\n'` vs `'scaffold\n'`), a **promoted** path whose two copies genuinely DIFFER. Three assertions added (`dual-home-parity.test.js:669-676`): the hit joins `enforced`, `differing` names it, and neither presence direction fires. **Proved the pin is real, not a second unpinned promise:** with the byte-comparison voided the new assertion reds (`actual: []` vs `expected: ['wiki-vault/.fkit/session-state']`), 8 pass / 1 fail. | ✅ done |
| R9 | CORRECT | Defect (doc) | **Measured independently before fixing:** the live prune points are `.fkit · knowledge-base/{decisions,history,incidents,reports} · sprints · tasks/{backlog,cancelled,done} · wiki-vault/.fkit · wiki-vault/wiki` — `tasks/backlog/.fkit` is **absent**, and `wiki-vault/.fkit` is the only exact-entry prune point. `conventions/dual-home-parity.md` no longer names it as one and carries a correction note stating the opposite role it actually plays. **The adjacent copy was fixed too, not left** — see the disclosure below. | ✅ done |
| R10 | CORRECT | Defect (doc) | Header rule 2 said a hit is excused when *"`findException` resolves it"*; `excusedBeneath` (`:230-241`) scans `exceptions` directly and never calls it. Header now says *"the exception list CONTAINS"*, and carries the **array-order reasoning** as the stated reason not to simplify it back — that reasoning is the load-bearing part, so it is recorded where the tempted reader is, not only in the docstring 130 lines below. | ✅ done |
| R11 | CORRECT | Frontier (owner-accepted residual) | None. Recorded below with a re-raise condition **and the severity disagreement**. Re-verified by re-running the disarm: variant 6 prints the no-op diagnosis, then still prints the false accusation, and the gate exits 1. | won't fix (frontier) |

**Disclosed: two of my six disarm variants did not fire on the first attempt, and the cause was my
harness, not the guards.** Variants 4 and 6 initially reported `exit=0`, no `MUTATION WAS A NO-OP` —
which would have read as "the R5 and R2 guards are dead". The cause was a bad `sed` pattern in my
scratch harness that silently matched nothing, so the disarm was never applied. Caught by diffing the
patched script against the original rather than by trusting the exit code. Re-run with the patch
verified applied, **both guards fire and fail the gate.** Recording it because an unexplained
first-attempt green on a guard test is exactly the shape this whole gate exists to distrust.

**Disclosed: one edit outside the three named findings, and why.** R9's finding notes that
`test/dual-home-parity.test.js:57` carries the same factually-wrong example, marks it adjacent and
NOT raised (round-1 cleared, pre-existing), and says **"fix both or neither"**. I fixed both. Fixing
only the convention would have left a known-false statement in the file the reviewer is most likely to
read next, in the same round that corrected it elsewhere — and the header was already being edited for
R10. It is a comment correction, mechanical and localized, with no behavior change. **If the owner
wanted the test header left alone, this is the edit to revert** (`dual-home-parity.test.js:61-67`).

**One reviewer suggestion deliberately NOT taken, per the owner's ruling.** The reviewer offered
`if (promoted.has(p)) continue;` as a demonstration that the promise is unpinned, not as a fix. I used
it only as the falsification probe. Adding it as a guard would have removed the behavior instead of
pinning it.

**Round 2 verification — run, not assumed** (R8 touches the parity suite's assertions, so the four
gates were re-proved rather than trusted):

| check | result |
|---|---|
| R8's pin actually fails when the promotion's byte-comparison is removed | ✔ 9 tests, **8 pass / 1 fail** — `actual: []` vs `expected: ['wiki-vault/.fkit/session-state']`. Before the fix the same mutilation was **9/9 green**. |
| `node --test test/*.test.js` | ✔ **560 tests / 17 suites / 560 pass / 0 fail** — unchanged count (R8 added assertions to an existing test, not a new test) |
| `bash test/prove-red.sh` | ✔ `0a`–`0h` green, mutations 1–13 all red at their named assertions, `✓ hard gate PASSED`, **exit 0** |
| disarm proof, mutations 10–13, six variants | ✔ every one printed `MUTATION WAS A NO-OP` and the gate **FAILED** — V1 m10 target renamed · V2 m11 probe given a live counterpart · V3 m12 target renamed · V4 (**R5**) `.orig` snapshot fails, append succeeds · V5 m13 probe repointed at an already-co-present path · V6 (**R2**) m13's destination directory removed so the `cp` silently fails |
| grep-fragment cross-match matrix, re-measured after the new assertion text | ✔ clean diagonal — m10 presence-only · m11 presence-only · m12 byte-identical-only · m13 tripwire-only. **No cross-match.** One near-collision was avoided deliberately: a draft of the new assertion message read *"present in both homes"*, one case-fold away from mutation 10/11's grep fragment `present in BOTH homes`; reworded to *"co-present"* rather than left to rely on case-sensitivity. |

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

## Round 2 — reviewer report (the R1 / R2 / R5 / R7 fix diff)

**⚠️ Changes requested — 4 defects (none blocking). The R1 tripwire rewrite is SOUND. There is no
third regression.** Scope was the fix diff only; nothing round 1 cleared was re-reviewed.

**Reviewers run: BOTH.** Reviewer pass + Codex adversarial pass (`codex-cli 0.145.0`,
`codex exec --sandbox read-only`, exit 0, four findings returned). **Coverage is FULL — not degraded.**

### The two disclosed regressions — both independently confirmed CLOSED

Neither was taken on the coder's word; both were re-run.

1. **Presence tested against the walk sets.** Mutation 13 now reds **exactly one** assertion. Captured
   suite output: `✔` on *"the enforced dual-homed set is non-empty and every file is present in BOTH
   homes"*, `✔` on *"byte-identical"*, `✖` on *"no prune point hides a file that is dual-homed in
   fact"* — 9 tests, 8 pass, 1 fail. The rendered message names the file as *"present in BOTH homes"*,
   not "MISSING from ai-agents/". Fixture-level: a promoted, co-present, identical pair yields
   `onlyInLive=[] · onlyInScaffold=[] · differing=[]`.
2. **`excusedBeneath` matching the prune point's own entry.** Disarming is now structurally impossible
   at the boundary — probed both sides, all pass: entry AT the prune point (trailing-slash spelling)
   → excuses nothing; entry AT it (exact spelling naming a directory) → excuses nothing; entry ABOVE
   it → excuses nothing; exact entry strictly beneath → excuses that path only; nested directory entry
   strictly beneath → excuses the directory and its descendants; sibling → no. Prefix collisions are
   safe at the segment boundary (`tasks/backlogged/.keep` and `tasks/backlogx/` both correctly refused
   under the `tasks/backlog` prune point) because `under` appends the `/`.

**Hunted a third regression in the mechanism: none found.** `promoted ⊆ co-present` by construction
(`hidden` is built only where `collectAll` reports the path in both roots), so `promoted.has(p)`
standing in for presence is sound rather than assumed. A path cannot be in a walk set *and* promoted:
the same exception list drives both homes, so a prune point prunes symmetrically; where a prune point
exists on one side only (directory live, file or absent in the scaffold) `collectAll` returns empty and
nothing is promoted — probed, `enforced=[] · hidden=[]`, no false report. **Non-vacuity cannot be
silently propped up by promotion:** `promoted` is exactly the tripwire's hit set, so a non-empty
`promoted` implies a non-empty `hidden`, which reds the tripwire loudly on the same file. The disclosed
double-report (tripwire + byte-parity when a promoted pair also differs) reproduces and is exactly what
the header declares.

### The failure message now names only remedies the code honors — verified end to end

The R1 defect was a message prescribing something that silently did not work, so the rendered output
was read, and both prescribed remedies were **executed against the code**, not reasoned about:

- *"give it its own exception entry WITH A REASON, at a path strictly BENEATH the prune point (an exact
  path…)"* — adding the exact entry silences the tripwire (`hidden` 1 → 0) and takes the path back OFF
  the enforced set.
- *"…or a directory path ending in `/`"* — a nested directory entry strictly beneath also silences it.
- *"An entry at `<prune point>` itself or above it is the blanket, and will not silence this"* — true.
- *"move it out from under `<prune point>`"* — true; the walk then reaches it and enforces byte-parity.

### The coder's declared judgment call — both claims verified

- **`findException` is array-ordered between two directory entries.** Confirmed empirically: with a
  nested `tasks/backlog/nested/` appended AFTER the blanket, `findException('tasks/backlog/nested/f.md')`
  returns `tasks/backlog/`, the blanket. `excusedBeneath` is correctly order-independent on the same
  input. Exact-beats-directory still holds (`findException('tasks/backlog/.fkit').kind` = `runtime-state`).
- **No directory entry is nested inside another today.** Confirmed over all ten directory entries —
  zero nested pairs. The hazard is genuinely latent, and the branch is unit-tested rather than promised.

### The prove-red.sh guards — re-run, not read

**Disarm proof, six variants, run independently of the coder's report. Every one shouts and fails the
gate** (each printed `MUTATION WAS A NO-OP` and exited non-zero):

| variant | disarm | result |
|---|---|---|
| 1 | mutation 10's target renamed away | ✗ *"tasks/README.md is not in the copy"* · gate FAILED |
| 2 | mutation 11's probe given a live counterpart | ✗ *"a LIVE counterpart now exists"* · gate FAILED |
| 3 | mutation 12's target renamed away | ✗ *"is not in the copy"* + the R5 guard also fires · gate FAILED |
| 4 | **R5** — the `.orig` snapshot copy fails, append succeeds | ✗ *"the append did not change the file, or the `.orig` snapshot could not be written"* · gate FAILED |
| 5 | mutation 13's probe repointed at an already-co-present path | ✗ *"the probe needs … to exist and … NOT to"* · gate FAILED |
| 6 | **R2** — `rm -rf "$m13/knowledge-base/reports"` so the `cp` silently fails | ✗ *"the copy into the mutant scaffold did not land at knowledge-base/reports/README.md (is its parent directory missing from the copy?)"* · gate FAILED |

Variants 4 and 6 are the two fixes exercised on their **realistic** triggers. **R2's guard inspects the
MUTANT COPY, not the repo** — that is the whole correction, and variant 6 is the case the old repo-side
pre-check was blind to. **R5's guard catches `cmp` exiting 2 as an error** rather than reading it as
"equal". Residual on variant 6: R11 above.

**Grep-fragment uniqueness after the message rewrite — verified as a matrix, not by inspection.** Each
mutation's captured suite output was tested against all three fragments on a `(✖|not ok|fail)` line.
Result is a clean diagonal — m10 → *present in BOTH homes* only; m11 → *present in BOTH homes* only;
m12 → *byte-identical* only; m13 → *no prune point hides a file* only. **No cross-match.** The rewritten
message introduces no `byte-identical` occurrence, and neither new test name collides with any fragment.

### Assessed and NOT raised (do not chase)

- **Codex `prove-red.sh:497` — "the guard conflates *mutation unchanged* with *snapshot unavailable*".**
  Substantially **disproven**. The message explicitly names both causes (*"…or the `.orig` snapshot
  could not be written, so the mutation cannot be verified at all"*), so it does not claim the mutation
  failed. Codex also treats "forces the hard gate red even if the byte assertion catches the change" as
  a defect; **failing closed is correct** for a script whose thesis is that an unverifiable gate is a
  disarmed gate. Frontier-move, no action.
- **The shared `FOOTER`'s *"fix by editing BOTH copies in the same change"* is not a tripwire remedy.**
  Pre-existing, unchanged by this diff, and read and cleared in round 1. Out of scope.
- **Descendants of an exact entry naming a directory are not excused by that entry** (e.g. a file under
  `tasks/backlog/.fkit/`). Verified as **deliberate and documented** (`:71-73`) and pinned by test 8.
- **Live effect of the whole fix: none.** The enforced set is still exactly the same four files —
  `knowledge-base/conventions/priority-is-rank-not-identity.md`, `…/task-owner-vocabulary.md`,
  `tasks/README.md`, `wiki-vault/schema.md`. R4's residual re-raise condition (the set SHRINKING) is
  **not met**. R3's (a symlink appearing) is **not met**. R6's (a drift report misread) is **not met**.
- **`npm test` reproduces the claim exactly:** 560 tests / 17 suites / **560 pass / 0 fail**, then
  `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion`, exit 0.
  551 baseline + 9 (was 559/8; one test added). `0h` still green, so the reds below it still isolate.

## Round 2 — re-litigates settled decisions (suppressed)

**None.** Neither reviewer re-raised R3, R4, R6, the 0112 residual, or any of the four owner rulings of
2026-08-01. Codex was primed with all of them and respected the priming.

## Round 2 — convergence call

**Act, then close — do not run a round 3.** This round found **no new defect in the mechanism**: the
part that was wrong twice is now right, proved by re-running the mutations rather than by reading the
change. All four findings are **low** and none touches behavior that is live today. R8 is the only one
with teeth — it is the R1 defect species (a message promising what nothing pins), and its fix is one
assertion on a fixture that already exists. R9 and R10 are one-sentence doc corrections. R11 leans
frontier and may reasonably be recorded rather than fixed.

**Do not re-review after these land.** They are additive and independently checkable — an assertion on
an existing fixture and three sentences. Round 3 would cost more than it could find.

## Accepted residuals (shared, do-not-re-litigate)

Owner dispositions — R3 · R4 · R6 and the 0112 item on **2026-08-01**, R11 on **2026-08-02**. Each
carries an explicit **re-raise only if**, so the residual is
falsifiable rather than permanent — a reviewer meeting the condition is raising a NEW finding, not
re-litigating a settled one.

- **Symlinked excepted directory escapes both controls (review R3)** — What:
  `readdirSync(…,{withFileTypes:true})` reports a symlink-to-directory with `isDirectory() === false`,
  so an excepted path that is a symlink is skipped by the walk AND never added to `prunePoints`; a
  co-present file beneath it is neither enforced nor tripwired, and the suite is **silently green**. ·
  Why (structural): the safe-direction alternatives cost more than the hazard is worth today —
  measured mitigant, **zero symlinks exist in either home** (`find ai-agents claude/scaffold/ai-agents
  -type l` = 0, re-verified 2026-08-01), so the escape is latent with no live instance. Following
  symlinks would also open the walk to cycles and to paths outside the home. · **Re-raise only if:** a
  symlink appears anywhere under `ai-agents/` or `claude/scaffold/ai-agents/`.

- **`readdirSync` errors swallowed at every depth (review R4)** — What: the `catch { return; }` in
  `walkHome` (`test/dual-home-parity.test.js:129-133`) is inside `descend`, so it applies mid-tree as
  well as at the root; if the same subdirectory is unreadable in **both** homes its dual-homed files
  vanish from the enforced set while the other files keep the set non-empty, so non-vacuity still
  passes. · Why (structural): the root case the docstring justifies is genuinely safe (a bogus scaffold
  root makes every live file read as missing → red; both roots missing → non-vacuity fires), and the
  mid-tree case needs a permissions failure on a directory that is readable enough to be `cp`-able in
  CI. Distinguishing "missing" from "unreadable" per depth is a real design change, not a one-liner. ·
  **Re-raise only if:** the enforced set is ever observed to SHRINK without an explanatory change to
  the trees or the exception list (today: exactly 4 files — `conventions/priority-is-rank-not-identity.md`,
  `conventions/task-owner-vocabulary.md`, `tasks/README.md`, `wiki-vault/schema.md`).

- **`firstDifference` column off by one inside a multibyte sequence (review R6)** — What: when the
  first differing **byte** lands inside a multibyte UTF-8 sequence, `a.subarray(0,i).toString('utf8')`
  decodes the partial sequence to `U+FFFD` and inflates the prefix by one character, so `aé` vs `aê`
  reports column 3 where the character column is 2 (reproduced 2026-08-01). · Why (structural):
  cosmetic — **both rendered lines are correct**, the path and line number are correct, and the clip
  window is centred close enough that the reader is never misled about *what* differs. Fixing it means
  decoding to the last complete code point, which is more machinery than a one-column display error
  earns. **This is an accepted DEFECT, not a defensible tradeoff** — recorded here because the owner
  ruled it accepted, and it should not be re-argued as though it were correct. · **Re-raise only if:**
  a real drift report is ever misread because of the column (e.g. it points into the wrong token), or
  the column is consumed by anything other than the clip window.

- **Mutation 13's false accusation still prints AFTER the no-op guard (review R11)** — Owner
  disposition 2026-08-02. What: the new post-condition at `test/prove-red.sh:540` sets `fail=1` but does
  not skip the mutation's run/verdict block, so a **disarmed** mutation 13 prints the no-op diagnosis
  AND then *"the suite did NOT catch a dual-homed file hiding under a blanket directory exception —
  0132's hand-off tripwire is not load-bearing"* about a test that is working correctly. Reproduced
  2026-08-02 (`rm -rf "$m13/knowledge-base/reports"` before the `cp`): both messages print, and the
  gate exits 1. · Why (structural): the no-op diagnosis prints **FIRST** and ends *"the result below
  proves nothing about the tripwire"*, so the reader meets the correct diagnosis before the wrong one;
  the gate **exits 1 either way**, so there is no false green; and **all 13 mutations share this
  annotate-don't-abort shape** (mutation 12 behaves identically at `:497-502`). Making 13 skip its block
  is a frontier-move on `prove-red.sh`'s whole design — one file forked away from a uniform convention —
  not a 0133 fix. · ⚠️ **SEVERITY DISAGREEMENT, recorded rather than smoothed over: Codex rated this
  MEDIUM; the reviewer rated it LOW and leaning frontier-move; the owner took the reviewer's severity;
  the coder independently agrees with LOW.** A future reader should know this residual was accepted over
  a live dissent, not by consensus — if Codex's reading is the right one, this entry is the thing to
  attack. · **Re-raise only if:** the gate is ever observed to report a **false green** on a disarmed
  mutation (i.e. `fail` is not set), OR `prove-red.sh` adopts abort-on-no-op as its convention for any
  other mutation — at which point 13 is an inconsistency rather than a frontier-move.

- **0112's re-verification cannot be discharged by this test — AT ALL (not a defect in 0133)** — What:
  task 0112's verification step for 0133 is reported **NOT APPLICABLE** with a substitute check, and
  the reviewer sharpened the reason: 0112's entire write surface lives under `claude/`
  (`skills-for-role.sh`, `skills/fkit-team/SKILL.md`, `README.md`, `scaffold/CLAUDE.md`) plus
  `ai-agents/knowledge-base/architecture.md`, which carries an exact `live-only` exception and has no
  scaffold counterpart at all. The intersection with the parity surface is **empty**, and being under
  `claude/` it will **never** intersect it — so the owner's "re-verify by hand once 0133 lands" ruling
  **cannot be discharged by this mechanism at all**, now or later. · Why (structural): reporting "pass"
  would have laundered an unrunnable step. Substitute check ran instead: `lead` ↔ `sprint-ship-loop`
  across the source of truth and its four mirrors, **PASS 5/5**, independently confirmed by the
  reviewer, including the disclosed self-correction (`architecture.md:144` drops the `fkit-` prefix, so
  a `fkit-sprint-ship-loop` pattern would have produced a false FAIL). · **Re-raise only if:** 0112's
  write surface ever gains a path under `ai-agents/` that is not excepted — otherwise this is an **open
  producer item** (the owner's manual re-verification is still owed and 0133 does not retire it), not a
  finding against this task.
