# Review — remove-fkit-omnigent-orphan-residue

Task: ai-agents/tasks/backlog/remove-fkit-omnigent-orphan-residue.md
File(s) under review: claude/orphan-targets, claude/fkit-claude-init.sh (§6), claude/fkit-claude.sh (--help), test/orphan-cleanup.test.js
Status: closed-out

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | claude/fkit-claude-init.sh:632-658 | A symlinked **parent** escapes `$dest`: `[ -L "$p" ]` guards only the leaf, so `.fkit → /outside` makes `rm -rf` delete `/outside/agents` + `/outside/run`. Reproduced. Contradicts this file's own §1 doctrine (:161-172) that `-L` must precede any deref because a symlinked *subdir* is written straight through. Announcement then claims "Nothing else was touched." |
| R2 | 1 | med | claude/fkit-claude-init.sh:596 | The gate **fails open**. `grep … 2>/dev/null \| grep -vxF … \|\| true` maps *any* grep failure to "no references" → a genuinely **referenced** target is deleted and announced as "referenced by nothing". Reproduced with a grep that exits non-zero: `.fkit/run` deleted despite a live reference the working gate correctly refuses. Exactly the silent fail-open the `.fkit-keep-out` parser was hardened against (:96-116), now reintroduced in the destructive path. |
| R3 | 1 | low | claude/fkit-claude-init.sh:618-632 | No containment check on list lines: `..` is not rejected/normalized, so a line of `../escape` yields `rm -rf "$dest/../escape"` outside the project root. Reproduced. Defense-in-depth gap only — editing the shipped list is already a new owner decision — but the `*settings*` belt-and-braces guard at :624 shows that bar was accepted for this file. Announcement text ("fkit's own, gitignored") is false in this case. |
| R4 | 1 | low | test/orphan-cleanup.test.js:96-111, 210-222 | Test gap of the R1/R3 class, not vacuity: `manifest()` walks **only `$dest`**, so no assertion in the suite can observe a deletion *outside* the project root. F's symlink test covers the **leaf** case only; no parent-symlink case, no grep-failure case, no containment case. The negative assertions are real — just scoped to the wrong boundary for the escape class. |
| R5 | 1 | low | claude/fkit-claude-init.sh:608, 624 | Two consistency nits, both fail-closed and non-fatal (verified): (a) the list is tested with `[ ! -f ]` but never `-r`, so a `chmod 000` list leaks a raw bash "Permission denied" instead of an fkit-voice message — cf. the `-r` check the keep-out parser has at :106; (b) the `*settings*` refusal at :624 runs *before* the existence check, so a bad list entry would print its refusal on every launch forever, unlike every other refusal here. |

### Round 1 addendum — Codex second opinion (coverage now COMPLETE)

Codex `gpt-5.6-sol`, reasoning effort high, `--sandbox read-only`. Ran against the same unmodified tree
as R1–R5. Seven findings returned, **zero overlap with R1–R5** — the dedupe brief held. Severities below
are **mine, not Codex's**: I re-derived each from the blast radius I traced and **downgraded four of
Codex's five "medium" labels** once the fail-closed direction or the owner-decision gate was accounted
for. Codex's pass was **static only** (its sandbox denied `os.tmpdir()`); I reproduced C1, C2, C6 and C7
locally myself — the rest are static-verified by reading only, and are marked as such.

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| C1 | 1 (addendum) | low | claude/fkit-claude-init.sh:596 | Gate matches **byte substrings**, not references: `grep -rlF -- ".fkit/run"` hits a source that only mentions `.fkit/runner`. **Reproduced.** Codex called this med; it is **low — the false-positive direction is fail-CLOSED** (spurious refusal, nothing deleted), the opposite of R2's fail-open. Codex's paired false-negative half (a reference built as `".fkit/" + "run"`) is **not reproduced and I judge it speculative** for a static shell tree — no such construction exists in `claude/` today. Note this is the same substring looseness as C5, pointing the safe way. |
| C2 | 1 (addendum) | med | claude/fkit-claude-init.sh:668 | `rm -rf` is **non-atomic**: it deletes children, then fails to unlink the target, and the code announces the whole path under "did NOT remove … will not without a look from you" — inviting the user to inspect a directory it has already **emptied irreversibly**. **Reproduced, and worse than Codex stated**: with `.fkit` at 0500, `.fkit/agents/precious.md` and `sub/deep.md` were both destroyed while `rm` reported failure. This is **exactly the fixture test F uses at :228**, so the suite already runs the partial delete and never looks. Load-bearing because **announce-only consent makes the announcement the entire consent mechanism** — a false announcement in the destructive direction is a broken consent model, not a cosmetic bug. Held at med, not high: absent R1/R3 the destroyed content is a dead orphan we meant to delete anyway. **It is a severity amplifier on R1/R3** — an escaped partial delete would be announced as "not removed". |
| C3 | 1 (addendum) | low | claude/fkit-claude-init.sh:682 | Announcements are buffered until after the loop, so an interrupt mid-cleanup leaves earlier paths **deleted and never announced** — and permanently silent, since the next launch sees them absent and says nothing (:635). Real, static-verified; needs a signal to land. Same "announcement is the consent" thread as C2. |
| C4 | 1 (addendum) | low | claude/fkit-claude-init.sh:654-668 | TOCTOU between the `-L`/`-e` checks and the `rm`: swapping the target for a symlink inside that window defeats the :654 refusal. Static-verified, not raced. Codex called this med; **low — it needs a local attacker with write access to the user's own project**, and R1 already covers this class with a far cheaper trigger (no race at all). Fixing R1 does **not** fix C4; deciding C4 is a frontier-move (shell TOCTOU is not closable without `openat`-class primitives) is defensible. |
| C5 | 1 (addendum) | low | claude/fkit-claude-init.sh:596, 624 | Both the `*settings*` guard and the gate are **case-sensitive**, while macOS project volumes are typically case-**in**sensitive: a list entry `.fkit/SETTINGS` passes both guards yet resolves to live `.fkit/settings` — the one hard invariant. Static-verified. Codex called this med; **low, and it is R3's class exactly**: only reachable by editing the shipped list, which the list header already declares a new owner decision. Worth noting the belt-and-braces guard at :624 exists *precisely* to survive a bad list edit, so it is fair to hold it to that bar. **Recommend disposing of C5 together with R3** — same question, same answer. |
| C6 | 1 (addendum) | low | claude/fkit-claude-init.sh:617 vs test/orphan-cleanup.test.js:77 | Runtime filters comments only at column one (`case "$line" in ''\|'#'*`) with no whitespace trim; the test trims first. **Reproduced**: an indented `   # comment` is a comment to the test and a **deletion target to the runtime**. Harmless today (the path won't exist → `continue` at :635) and the shipped list has no indented comments — but it is a **test that does not test the runtime's parser**, so the divergence is invisible and will stay green while drifting. |
| C7 | 1 (addendum) | med | test/orphan-cleanup.test.js:224-236 | The non-fatal test **can pass vacuously**, leaving a *mandatory owner bar* untested. **Reproduced**: under its own `chmod 0500 .fkit` fixture the first three targets fail and only `.omnigent` is removed — but the test asserts solely `exec === true` and one `/could not remove/` match. It **never asserts `.omnigent` is gone**, which is the only assertion that proves the loop *continued past* the failures. An implementation that aborted the whole loop on first failure passes this test unchanged. Distinct from R4 (that was `manifest()`'s boundary; this is the assertion set). One added line fixes it. |

**Coverage.** Two independent passes now complete — the Round 1 PARTIAL flag is **cleared**. Residual
gaps, stated rather than papered over: Codex ran static-only, so nothing of C4's race was dynamically
proven by either pass; and **Codex was silent on** the `<<EOF` heredoc at :645-647, IFS/globbing in the
announcement assembly, dry-run fidelity, `$dest`/`$here` containing spaces or globs, `set -e`
interactions, and whether the test file is wired into the runner. **Silence there is uncovered ground,
not a clean bill** — my own pass did not target them either.

### Round 2 — the uncovered ground (both passes complete)

Scope: the **owner-directed** pass over what Round 1's addendum admitted it had not covered. Not a
re-swing at the same tree — R1–R5 and C1–C7 are fixed, so this is new code. Codex `gpt-5.6-sol`,
effort high, `--sandbox read-only`. **First Codex invocation returned no findings** (it exhausted its
budget on tool output and terminated mid-investigation); re-run with a narrowed prompt and it returned
three. **Coverage is complete** — but that re-run is why, and the first attempt is recorded rather than
quietly dropped.

**Codex independently reproduced R6 and R7** — two passes, same two defects, no priming toward them.
**R8 is Codex's alone; I missed it.**

**Round 2 dispositions recorded 2026-07-17** (owner interview; reviewer verified each against the tree
before recording — I did not take the coder's report on trust):

- **R6 → ACCEPTED as a residual, not fixed.** Recorded below under *Accepted residuals*. I verified the
  in-code documentation at `claude/fkit-claude-init.sh:773-781`: it names the shallow count as accepted,
  names `find "$p" | wc -l` as the honest fix, and states *"Do not read the 'left as it is' branch as a
  guarantee — it is a best effort at one level."* The branch is no longer claimed as a guarantee. **I
  concur with the acceptance and with its pricing** — see my confirmation of the residual below.
- **R7 → RESOLVED by deletion.** Verified at `test/orphan-cleanup.test.js:394+`: the vacuous test is gone,
  replaced with a `⛔` comment stating the gap, the owner ruling, and the instruction to write it
  red-first against the **nested** fixture if R6 is re-raised. **Deletion was the right call over repair**:
  the test's premise was false, so a repair would have preserved a fixture that could not reach the
  behavior. A named gap beats a green test that certifies the bug. Resolved.
- **R8 → RESOLVED.** Verified: `line="${line#/}"` is gone from the orphan parser (the sole surviving
  occurrence, `:123`, is the **keep-out** parser — a different function where a leading slash genuinely is
  harmless, and the comment at the orphan site now says exactly why the two differ). `orphan_contained()`'s
  `/*)` branch at `:649` is now reachable. Red-proved before the fix. Resolved. **Credit to Codex — this
  was its find alone, and neither my pass nor the coder's saw it.**
- **C3's third re-raise condition → STRUCK**, owner-ruled. My challenge is spent; the note now lives in
  C3's own residual with the reasoning preserved against helpful re-addition. **The C3 ruling itself I did
  not contest and do not contest** — I challenged one inert tripwire, not the trade. My stale round-2
  comment block, misfiled under R6's residual, is removed as superseded.
- **C2's ledger row → CORRECTED** to *"partial — superseded by R6"*. Confirmed. The false `✅ done` is
  called out rather than quietly overwritten, which is the right handling — a corrected record that hides
  the correction teaches nobody.
- **§4 scoping call → upheld and filed** as `ai-agents/tasks/backlog/gate-symlink-escape-in-init-intake-write.md`,
  cross-linked against `gate-read-side-symlink-hazard-in-init.md`. This is the disposition I care about
  most and it is now the one I can stop caring about: **a flagged finding with no brief evaporates.** The
  producer's widening to "extract the rule once" rather than "patch §4" is a better call than my own — §4
  would have been the *fourth* manual application of `-L`-before-deref.
- **Enforcement-point question → recorded, not acted on.** Owner-ruled. I raised it; I accept parking it.
  Noting only that it is now recorded in a backlog brief rather than in this ledger, which is where a
  question survives closeout.

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R6 | 2 | med | claude/fkit-claude-init.sh:764-789 | **C2 is not fixed — it is fixed for the flat shape only, and is still marked ✅ done.** The partial-delete detector counts `ls -A "$p" \| wc -l`, which is **shallow**, while `rm -rf` is **recursive**. Lock the target dir itself (0500) with a *writable subdirectory* under it: `rm` cannot unlink the subdir from the target, but descends and destroys its contents — so the top-level count is **unchanged (1 → 1)** and the code takes the else branch. **Reproduced end-to-end against the real script**: `.fkit/agents/sub/deep.md` destroyed while stderr printed `.fkit/agents — could not remove it, and it was left as it is (check its permissions)` **and** `Nothing else was touched.` That is C2's exact sentence, in C2's exact destructive direction. Held at **med, not high, on C2's own calibration** — the destroyed content is inside a named target and R1's fix keeps it inside `$dest`, so the harm is the lying announcement under announce-only consent, not the data. |
| R7 | 2 | med | test/orphan-cleanup.test.js:375-395 | **The test written to prove C2 is vacuous, and it asserts the bug is correct.** Its fixture chmods **0500 the target itself**, and its comment — *"rm -rf can unlink the CONTENTS (it needs write on the parent for that, which it has)"* — **is wrong**: unlinking an entry needs write on **that** directory, not its parent. So `precious.md` always survives → `emptied` is **always false** → the `if (emptied)` branch holding the entire C2 assertion is **dead code**, and the `else` branch actively asserts `/could not remove it, and it was left as it is/` **as the correct output** — while, verified under the same fixture, `.fkit/agents/fkit-coder/agent.yaml` **is destroyed**. Codex adds: the else's `\|removed these` alternative can be satisfied by a *different* target's removal line, weakening it further. This is the coder's own named pattern — **"asserting the complaint rather than the behavior" — fourth instance, now inside the fix for C2 itself**, and it is precisely why R6 shipped green. C7's lesson generalizes further than C7. |
| R8 | 2 | low | claude/fkit-claude-init.sh:696 vs :649 | **`orphan_contained()`'s absolute-path refusal is dead code.** `line="${line#/}"` at :696 strips the leading slash **before** the `case "$1" in /*)` check at :649 ever sees it, so that branch **cannot fire**. Two pieces of code disagree about absolute paths: one silently normalizes them, one claims to refuse them — and the normalizer runs first. **Reproduced**: a list line `/tmp/cache` deletes `$dest/tmp/cache` and announces it as `tmp/cache` — the report does not even echo what the list said. **Contained** (never escapes `$dest`; R1's walk still starts at `$dest`) and reachable only by editing the shipped list = a new owner decision → **low, exactly R3/C5's class**. Flagged because a guard that cannot fire reads as protection to every future maintainer. Codex's find, not mine. |

**Cleared, not silent** — I targeted each and found nothing; stating this so the closeout is not mistaken
for another gap:
- **`<<EOF` heredoc** (:747-749) — **safe**. Unquoted delimiter expands `$refs` in a **single pass**; the
  *value* is not re-scanned. Probed with filenames containing `$(touch …)`, backticks, spaces, globs — no
  execution, listed verbatim. `IFS= read -r` handles the rest.
- **IFS / globbing in the announcement assembly** — **safe**. String accumulation + `printf '%s'`
  throughout; no `for p in $removed`. The comment at :670-672 is accurate.
- **Dry-run fidelity** — **verified identical.** Every refusal path (containment, `*settings*`,
  non-existence, gate rc-2, gate refs) is evaluated **identically** in both modes; `dry` branches only
  after all of them. Diffed the announced sets on a full-residue fixture: **byte-identical**. The one
  divergence is inherent and honestly labelled — dry reports the *decision* set, and cannot know an `rm`
  will later fail.
- **`$dest` / `$here` with spaces or globs** — **safe**. Ran init with `$here` = `my dir [x]` and `$dest`
  = `proj * name`: all three targets correctly removed, announcement correct. All expansions quoted;
  `grep -F` keeps the exclusion literal.
- **`set -euo pipefail`** — the coder's belief is **correct, verified not taken on trust**. Every
  substitution that can fail is guarded: `orphan_contained` inside `if !`, `orphan_refs` via `|| gate_rc=$?`,
  both `ls -A | wc -l` via `|| had=""`, the sed via `|| return 2`, the `grep -vxF` via `|| true` (pipefail-safe).
  **Two unguarded** — `line="$(… | tr -d '\r')"` :689 and `lc="$(… | tr …)"` :717 — a `tr` failure would kill
  init under `set -e`. Negligible, not a row; noted so it is not re-found.
- **`orphan_contained()` escapes** — **holds.** Refused: parent symlink, **leaf** symlink, `../escape`,
  `a/../../b`, absolute. Passed correctly as no-ops: `a//b` (empty segs), `a/./b` (`.` segs), deep chains.
- **`orphan_refs()` ERE boundary** — **correct in both directions, no fail-open found.** Matched EOL,
  `"`, `/child`; correctly skipped `runner`, `run.log`, `run-old`. `.` and `-` sit inside the class, so
  `run.log`/`run-old` are genuinely different paths, not misses. The `sed` class covers every metachar
  in all four shipped tokens.
- **`*settings*` guard, existence-gated (R5b)** — **not weakened.** `continue` at :724 sits **outside**
  the `if [ "$exists" = 1 ]` — the refusal to delete is unconditional; only the *announcement* is gated.
- **Test wiring** — the coder's own check **confirmed, not taken on trust.** `package.json:5` runs
  `node --test test/*.test.js`; `test/orphan-cleanup.test.js` matches; ran it: **7 suites, 23 tests, 23
  pass**. All seven groups execute. (23 of them pass — including R7's vacuous one.)

### Convergence call — Round 2 is CLOSED

**Verdict: closed-out.** Coverage complete (both passes, both rounds). Nothing blocks.

**Why closed and not another round.** Every round-2 finding has a disposition: R7 and R8 fixed and
verified by me against the tree, R6 accepted with observable re-raise conditions and documented at the
code site. **No finding is open.** No new pass was run and none is warranted: this closeout is the
owner's rulings being recorded, not a fresh swing, and re-reviewing a tree whose every finding is
disposed of is how a review loop becomes a review habit. The one round-2 thread that could have kept
the ledger open — my challenge to C3's third condition — was ruled and struck.

**The convergence signal, stated for the record.** Round 2 was **not** re-litigation: it produced three
genuinely new defects on the uncovered ground Round 1 admitted, with zero overlap against R1–R5/C1–C7
and zero against the accepted residuals. That is a productive round, not a loop. **But the ground it
covered is now the ground that is covered** — a Round 3 over the same tree would have to invent scope,
and the two live questions that remain (the `-L`-before-deref enforcement point, and §4's write-side
escape) have **left this ledger for briefs**, which is exactly where they survive a closeout and this
ledger is where they would die.

**What I am NOT certifying**, so closed-out is not read as clean:
- **R6 ships knowingly broken.** fkit will announce "left as it is" about a subtree it has emptied, in
  the nested case. Accepted on blast radius, not fixed, and the honest fix is known and cheap.
- **There is deliberately no test for R6.** The suite is green *and* a named gap sits in it by ruling.
  Green here means "no test fails", not "the announcement is true".
- **C4's race and C3's buffered announcement remain open by design.**
- **Two unguarded `tr` substitutions** (`:689`, `:717`) noted in Round 2 and never made a row. Still
  there, still negligible, recorded so the next reviewer does not spend a pass re-finding them.

**The lesson worth carrying past this ledger** — the coder's own correlation, which I confirm and will
not soften: **every fix that was red-proved (R1, R2, R8) survived review; every fix that was not (C2,
and C7's own fix) was found broken by someone else.** Two for two, in both directions, in one task. R7
was the fourth instance of "asserting the complaint rather than the behavior" — *inside the fix for C2,
after the pattern had already been named twice in this very ledger*. Naming a pattern does not stop it;
a red-first test does. That belongs in `conventions/evidence-before-assertion.md` as a worked example,
not only here — **recommend it be filed** (not my call, and not a blocker on this closeout).

## Coder response

Round 1, all twelve findings novel — nothing matched an accepted residual (there were none) or an ADR's
re-raise condition. **Zero re-litigation; zero closeout.** Severities below are mine, re-derived from the
blast radius; I agreed with the reviewer's on every row, including its four downgrades of Codex's labels.

I did not disprove a single finding. That is not deference — I tried, and each one reproduced. Owner
dispositions taken in the interview of 2026-07-17.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect | New `orphan_contained()` walks **every component** from `$dest` to the leaf, refusing on `-L` at any level (and on absolute paths). Replaces the leaf-only `[ -L "$p" ]`. Red-proved: with the guard neutered, the outside file is destroyed again. | ✅ done |
| R2 | CORRECT | Defect | `orphan_refs()` now returns **rc 2** when grep exits >1 ("could not run") and the caller **refuses** the target. "Could not check" and "found nothing" are no longer the same answer. Red-proved with a grep stub exiting 2. | ✅ done |
| R3 | CORRECT | Defect | Falls out of R1's guard: a `..` segment is **refused outright**, never normalized-then-checked. Owner ruled fix (interview Q1). | ✅ done |
| R4 | CORRECT | Defect (test gap) | Added a parent-symlink test asserting against a manifest of the tree **outside** `$dest` — the boundary the suite could not previously see. Plus a `..`-containment test and a gate-cannot-run test. | ✅ done |
| R5 | CORRECT | Defect | (a) list now tested `[ ! -r ]` as well as `[ ! -f ]`, with an fkit-voice message + a fail-closed test; (b) the `*settings*` refusal is now existence-gated like every other refusal. | ✅ done |
| C1 | CORRECT | Defect | Gate matches a **path-segment boundary** (`($\|[^A-Za-z0-9_.-])`), so a short target no longer hits a longer unrelated path. Tested both directions: the lookalike is cleaned; a reference to a path *inside* a target still refuses. | ✅ done |
| C2 | CORRECT | Defect | ⚠️ **STATUS CORRECTED IN ROUND 2 — this row previously read ✅ done and that was false.** The three-state announcement (removed / PARTLY REMOVED / untouched) is real and shipped, but it detects only the **flat** case; see R6. Partially fixed, not fixed. | **partial — superseded by R6** |
| C3 | CORRECT | **Frontier** | None — recorded as an accepted residual (owner ruled, interview Q5). The tradeoff is a fragmented report on every run vs. a window you must be actively killing fkit to hit. | won't fix (frontier) |
| C4 | CORRECT | **Frontier** | None — recorded as an accepted residual (owner ruled, interview Q2, explicitly *"don't pretend to fix it"*). Not closable in shell; a partial mitigation would shrink the window while making the code read as safe. | won't fix (frontier) |
| C5 | CORRECT | Defect | Both guards case-normalized: `*settings*` tested against a lower-cased line, and the gate greps `-i`. Over-matching only ever refuses, never deletes — errs safe. Owner ruled fix alongside R3 (interview Q1). | ✅ done |
| C6 | CORRECT | Defect | Runtime now trims surrounding whitespace **before** the comment test, so an indented `#` is a comment to the runtime and the suite alike. Tested both halves: commented path survives, indented real target is still a target. | ✅ done |
| C7 | CORRECT | Defect (test gap) | The non-fatal test now asserts **`.omnigent` is gone** — the assertion that proves the loop continued past the failures. An implementation aborting on first failure now fails the suite. | ✅ done |

### Round 2 rows

Owner dispositions from the interview of 2026-07-17 (round 2). **I disproved nothing: R6, R7 and R8 all
reproduced.** R8 I red-proved before fixing — it deleted `$dest/tmp/cache` and announced it as a clean
removal.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R6 | CORRECT | Defect → **accepted by owner** | None. The shallow `ls -A` detection stays. Documented in-code at the count site as an accepted residual with the honest fix (`find "$p" \| wc -l`) named for whoever re-raises it, and recorded below. **The "left as it is" branch is no longer claimed as a guarantee.** | won't fix (owner-accepted) |
| R7 | CORRECT | Defect (test) | **Test deleted, not repaired** (owner ruled b1). It was built on a false claim about `rm -rf` permissions, so its `if (emptied)` branch was dead and its `else` asserted the wrong message as correct. Replaced with a comment stating the gap, why there is deliberately no test, and how to write one red-first if R6 is re-raised. | ✅ done |
| R8 | CORRECT | Defect | Removed the `line="${line#/}"` strip so the absolute-path refusal in `orphan_contained()` can actually fire. An absolute line is now **refused, not normalized** into a different real path. Red-proved before the fix; tested after. | ✅ done |

**On R6 being accepted while C2 was ruled fix** — worth recording, since the two rulings point opposite
ways and a later reader will notice. C2 was ruled fix on the principle that announce-only makes the
announcement the consent. R6 is that same defect one level down, and was accepted anyway. The
distinguishing fact the owner had in round 2 and not in round 1: `orphan_contained()` now guarantees the
destroyed content is **inside a named target**, so the residual harm is a wrong sentence rather than lost
data. Not an inconsistency — a narrower blast radius, re-priced. If R1's containment ever weakens, R6's
acceptance must be re-priced with it.

**Findings I have to own beyond their rows**, because they are all one mistake and it is mine:

- **C7 was my test lying about your mandatory bar.** I wrote a test named for the non-fatal bar that
  passed whether or not the bar held. Third instance this task of one shape: **asserting the complaint
  rather than the behavior.** I have since red-proved R1 and R2 by neutering each fix and confirming the
  bug returns — that is now the standard I should have applied from the start, not after a reviewer
  found the gap.
- **R7 is the fourth instance — inside the fix for C2, after I had already named the pattern.** I wrote
  a comment asserting that `rm -rf` needs write on the *parent* to unlink contents. It needs write on the
  directory holding the entry. I did not run it. The test built on that false premise could not execute
  its own check, so it certified the broken message and I reported C2 done on the strength of it.
  `conventions/evidence-before-assertion.md` exists for this, and task 27's recorded lesson says it in
  the same words: **a behavioral claim about a shell builtin or coreutil is a claim to run, not to reason
  about.** I reasoned. Thirty seconds of `mkdir`/`chmod`/`rm -rf` would have shown it.
  **The rule this leaves behind for anyone editing §6: red-prove the test, or do not claim the fix.**
  Every fix in this section that was red-proved (R1, R2, R8) survived review. Every one that was not
  (C2, and C7's own fix) was found broken by someone else.
- **The gate caught me twice while fixing R1** — my new comments re-introduced path literals into the
  script (once case-sensitively invisible to my own check, as `.Fkit/Run` inside the comment explaining
  case-insensitivity). Both times the gate refused every target and the feature silently no-op'd. The
  build-time test A2 missed the second one because it used a **different matcher than the runtime** —
  C6's defect class, at build time. A2 now uses the runtime's exact matcher. Two parsers, one grammar.

### Out of scope, surfaced not fixed — init §4 writes through a symlinked `.fkit`

Found while building R1's test, **not a reviewer finding and not task 36's code**: `fkit-claude-init.sh`
§4 does `mkdir -p "$dest/.fkit"` then writes `.fkit/interview`. With `.fkit` a symlink, that file is
created **outside the project**. Pre-existing, non-destructive (it creates, never deletes), and it
predates this task — but it is the same doctrine gap R1 was: `-L` applied to the deleting path and not
to the writing one. **Not fixed here** — fixing unrelated code inside a review round is how scope rot
starts, and §4's blast radius deserves its own brief. Flagged to the owner for the producer.

## Accepted residuals (shared, do-not-re-litigate)

- **TOCTOU between the symlink check and `rm -rf` (C4)** — What: fkit checks `-L` on every path
  component, then calls `rm -rf`; a swap inside that microsecond window defeats the check. fkit does not
  attempt to close it. · Why (structural): not closable in POSIX shell — it needs `openat`-class
  primitives that hold the directory handle across check and unlink. The rejected alternative (re-check
  immediately before the `rm`) shrinks the window while making the code *read* as race-free, which is
  strictly worse than an honest documented gap: it buys no safety and costs future readers the truth.
  An attacker who can win that race already has write access to the user's project and does not need
  fkit to do anything. Owner-ruled 2026-07-17: accept, document, *"don't pretend to fix it"*. ·
  **Re-raise only if:** this cleanup stops being shell, OR a path is found that wins the race without
  pre-existing write access to the project.
- **Buffered announcement (C3)** — What: the cleanup prints its report after the loop, so a kill
  mid-cleanup can delete paths that are never announced — and never announced later either, because the
  cleanup is self-limiting and the next launch sees them already absent. · Why (structural): the
  alternative (announce per path, before each delete) fragments the report on **every** run — the
  common case, forever — to close a window reachable only by actively killing fkit during the deletion
  of four paths. The announce-only consent model makes this a real cost, not a cosmetic one, which is
  why it is recorded rather than dismissed: it is a knowing trade, not an oversight. Owner-ruled
  2026-07-17. · **Re-raise only if:** the target list grows beyond a handful of paths (widening the
  window), OR the cleanup ever becomes non-self-limiting (so a missed announcement could be re-emitted).
  · _(A third condition — "or a real user hits it" — was struck on the reviewer's challenge, owner-ruled
  round 2. It was **inert by construction**: this residual's own premise is that the miss is permanently
  silent, so the condition depended on the very signal the accepted behavior suppresses. A tripwire that
  cannot be tripped is worse than no tripwire — it reads like a safety net. Noted so it is not helpfully
  re-added.)_
- **Partial-delete announcement is shallow (R6)** — What: when `rm -rf` destroys a target's contents but
  cannot unlink the target itself, fkit tries to report "PARTLY REMOVED" instead of "left as it is". The
  detection counts one directory level (`ls -A | wc -l`) while `rm -rf` recurses, so a **nested** partial
  delete (target at 0500, writable subdir) is still announced as untouched. C2's defect, one level down,
  knowingly unfixed. · Why (structural): this was ruled *fix* as C2 on the principle that announce-only
  makes the announcement the consent mechanism, then ruled *accept* as R6 on a fact that was not
  available in round 1 — `orphan_contained()` now guarantees anything destroyed is **inside a named
  target**, so the residual harm is a false sentence rather than lost user data. The honest fix
  (`find "$p" | wc -l`) is known and cheap; it was declined on blast radius, not difficulty.
  Owner-ruled 2026-07-17 (round 2), including the deletion rather than repair of the test that
  previously certified the wrong message as correct. · **Re-raise only if:** the containment guarantee
  from R1 weakens (then the destroyed content may no longer be a dead orphan, and the false sentence
  becomes a false sentence about the *user's* data), OR the target list ever includes a path a user
  might legitimately own, OR anyone relies on the "left as it is" branch as a guarantee.
  - **Reviewer confirmation (round 2, closeout).** I confirm this residual and its three re-raise
    conditions. All three are **observable off the code**, which is the bar the struck C3 condition failed:
    R1's containment guarantee is a property of `orphan_contained()` that any future edit to it puts in
    view; "a path a user might legitimately own" is a property of `claude/orphan-targets`, read at the
    moment someone adds a line; and reliance on the "left as it is" branch would have to appear as code or
    a test asserting it — which the in-code note at `:773-781` now explicitly warns against, so a future
    reader meets the caveat at the site, not only in this ledger. **No condition contested.**
  - **Cross-link, not a new finding: R6 is priced on a guarantee that C4 documents an accepted hole in.**
    R6's acceptance rests on *"orphan_contained() keeps the destroyed content inside a named target"*;
    C4's accepted residual is precisely a (narrow, race-window) way that containment can be defeated. The
    pricing still holds — C4 needs pre-existing write access to the user's project, so an attacker there
    does not need fkit — and I am **not** re-raising either. Recording the coupling because R6's first
    re-raise condition ("if R1's containment weakens") is the trigger, and **C4's own re-raise conditions
    are one way it weakens**. Whoever trips C4 must re-price R6 in the same breath. The two residuals are
    linked; a future reader should not decide one without reading the other.
