# Worklog — 0246: the consent-gated repair path inside `/fkit-heal` (propose-then-apply, v1)

**Builder:** fkit-coder, spawned as the `/fkit-sprint-ship-loop` Build worker under the loop's
declared-approval marker (owner approved the plan via `AskUserQuestion` in the live lead session,
2026-08-07; Q1 markerless root file ruled "Include, whole-file (Recommended)"; Q2 residual-fix
scope ruled "In scope (Recommended)"). Plan hash-verified against `plan.md` as the first action
(`git hash-object` → `5e730639b9e3d6c24d0fb0c316a9fa8f4cb0cab5`, 15090 bytes — matched the
driver's pin before any other read).

## What was built

| File | What |
| --- | --- |
| `claude/skills/fkit-heal/check.sh` | EDIT — the plan-§4 residual-fix pass, red-first: **R1** NUL-detection refusal (`has_nul`, `wc -c` vs `tr -d '\0'` before hashing → `unreadable` with NUL named; a NUL-bearing file can never reach `untouched-stale`, so the write gate never opens on the awk-truncation parity break); **R3** `-L "$root/ai-agents"` preflight hoisted above the keep-out block (a symlinked `ai-agents/` skips keep-out reading entirely; the row loop refuses the subtree `refused: symlink`); **R5** spec-path validation in the existing class-validation loop (absolute or `..`-segment row → loud exit 2; `parse_tables` untouched, R4 stays dormant); **R6** `valid_sha` guard (`^[0-9a-f]{64}$`) on the content hash and (belt-and-braces) inside `installed_hash`; **R8** the malformed-marker detail appends "(end before begin)" when counts are 1/1, matching the JS twin. Header updated (repair now exists, in repair.sh; check.sh stays read-only in every branch). No new outcome vocabulary. |
| `claude/skills/fkit-heal/repair.sh` | NEW — the deterministic propose/apply engine (ADR-017: all byte mechanics in script). `propose`: runs check.sh (same share/root), emits per `untouched-stale` row one `item<TAB>path<TAB>prehash<TAB>posthash` machine line (raw-byte sha256 both sides) + a `# diff` block (unified, via process substitution — no temp file); unsynthesizable rows excluded with a stated `# excluded:` reason (structurally defusing R7's write risk); exit 0 even when empty, 2 cannot-run. `apply`: reads approved item lines verbatim on stdin; per item, in order: path validation (relative, no `..`, hard `ai-agents/wiki-vault/` refusal — ADR-005 belt-and-braces), `-L` on the target and every ancestor, eligibility re-check against a fresh check.sh run (a forged owner-edited item dies here), raw-prehash freshness re-check (ADR-039 Decision 2), replacement re-synthesis + posthash compare (catches a mid-session `fkit update`), in-place write via redirect, written-bytes re-hash; one announce line per submitted item, refusals included; exit 0/1/2. Contains no move/remove/delete token (grep-fixture-pinned). Synthesis: reference file → scaffold bytes verbatim; root context file with one well-formed pair → scaffold body outside its markers + the project's marker region byte-for-byte (byte-offset `head`/`tail` slicing, no awk re-encoding); markers absent → whole-file replace (owner ruling Q1); malformed either side → excluded/refused, never guessed. |
| `claude/skills/fkit-heal/SKILL.md` | REWRITE — frontmatter description no longer "report-only in every branch"; outcomes-table `untouched-stale` row now "repair-eligible via this skill's repair phase (consent-gated, below)"; the plan-§3 repair procedure appended: live session required (headless stops at the check report), no manufactured consent question, propose presented in full and verbatim, ONE `AskUserQuestion` over the exact enumerated list with diffs in view, apply exactly the approved lines, per-path output verbatim with refusals loudest, consent never stored, fail-closed keep-out honesty carried into repair, vault always routed to fkit-wiki. |
| `test/structure-check.test.js` | EDIT — deliberate changes, each named: (1) `run()` gained an optional env override (needed by the R6 PATH-shim fixture); (2) the "end before begin" test extended to assert the R8 detail; (3) four new fixtures — R1 (NUL-injected old README → `unreadable`, detail names NUL), R3 (symlinked `ai-agents/` + unreadable foreign keep-out → `refused: symlink` rows, keep-out never consulted), R5 (doctored share with a `../escape` spec row → exit 2), R6 (PATH-shimmed broken sha tool → `unreadable`); (4) the header's "repair … does not exist" comment updated (repair exists in repair.sh; check.sh still read-only). 24 → 28 tests; `EXPECTED_ROWS` unchanged at 48. |
| `test/structure-repair.test.js` | NEW — 16 black-box tests over `bash …/repair.sh` mapping the plan-§6 matrix: propose/apply parity with a whole-tree changed-paths assertion (nothing outside the approved list, no new file anywhere — also the no-stored-consent mechanical proof), raw pre/posthash contract, empty proposal, freshness refusal (CRLF-ization: eligibility still passes, only the freshness gate refuses — `changed-since-propose` hit precisely), v1 boundary (owner-edited never proposed; forged item refused with the real classification named), the no-destructive-token grep fixture over BOTH scripts, single-write-redirect pin, ADR-005 vault fixtures (no vault proposal; forged vault item hard-refused naming ADR-005; subtree byte-unchanged), SKILL.md consent-shape prose pins, the §6.6 root-file matrix (marker region byte-for-byte through the rewrite + re-checks conforming; block-only drift not proposed; malformed markers unproposable and unforgeable), per-path announce (exactly one line per submitted item), post-propose symlink swap refused, R1/R6 repair-side seams, and the scaffold-absent exclusion (R7 defusal). |

## Verification (2026-08-07)

- **Red-first (plan §5 step 1, ADR-026-style hand-rolled probes):** all five residual fixtures were
  written first and proven RED against the pre-fix `check.sh`, observed pre-fix behavior recorded:
  - **R1** NUL-injected old README classified **`untouched-stale`** (live probe, transcript run:
    `untouched-stale  ai-agents/README.md  matches an older shipped version`) — i.e. the write gate
    would have opened on it; post-fix `unreadable`.
  - **R3** symlinked `ai-agents/` + foreign dir keep-out → the fail-closed **keep-out diagnosis**
    with no `ai-agents/` rows at all (the link was probed); post-fix `refused: symlink` rows and no
    keep-out message.
  - **R5** `../escape` spec row → **exit 1** (row silently classified; out-of-root probe); post-fix
    exit 2 naming the path.
  - **R6** broken-but-present sha tool → **`conforming`** (garbage hash == garbage installed-hash on
    both sides — drift became invisible; even worse than the residual's recorded owner-edited
    direction); post-fix `unreadable`.
  - **R8** detail read "1 begin / 1 end marker line(s)" with no order named; post-fix appends
    "(end before begin)".
- **`test/structure-check.test.js`: 28/28** (was 24: +4 fixtures, 1 extended).
- **`test/structure-repair.test.js`: 16/16** (new).
- **Full unit suite:** `node --test test/*.test.js` → **664 tests, 664 pass, 0 fail, 0 skipped**
  (was 644; +20 = the above). **prove-red hard gate PASSED** (all 14 mutations red their named
  assertions).
- **End-to-end smokes** (beyond the suite, run by hand): drifted fixture (old generic README +
  omnigent markerless CLAUDE.md) → propose (2 items + 2 diffs, rc 0) → apply (2 applied, rc 0) →
  re-check **exit 0, fully conforming**, both files byte-equal to the scaffold; marker-bearing old
  CLAUDE.md with a stuffed block → applied file == current scaffold body + the project's marker
  region **byte-for-byte** (python byte-compare), re-checks conforming.
- **Plan §6.9 change surface:** `git diff` **empty** for `claude/fkit-claude.sh`,
  `claude/fkit-claude-init.sh`, `install.sh`. `claude/structure-manifest.tsv` untouched (no regen
  run — skills are not manifest content). The working tree DOES show a `claude/scaffold/CLAUDE.md`
  diff, **attributed and verified not-mine**: it is 0245's uncommitted producer-row mirror edit
  (`/fkit-heal` added to the producer row — named in 0245's worklog); this task made no scaffold
  edit (R10 stays routed to task 0250).
- **Forbidden-token audit:** `grep -E '\b(rm|mv|unlink|rmdir)\b'` empty over both scripts (also
  test-pinned); `repair.sh` has exactly one write-redirect into the project (test-pinned) and no
  `mktemp`.

## Decision log (ADR-019/ADR-032 audit obligation — unattended calls under the standing approval)

Per-fix review approvals: **none processed** — this spawn is the Build worker; no review findings
reached it. Obvious-winner / interpretation calls made without asking, each inside the approved
plan's intent:

1. **The write step buffers the replacement before opening the redirect.** Plan §1(e) says "write
   in place via redirect (no temp-file rename)". The naive form — `synthesize > target` — is
   **self-referential** for marker-bearing root files: the redirect truncates the target before
   synthesize reads the marker region FROM that target. Found live (smoke: `error: verify-failed`,
   block lost), not hypothetically — the plan's own posthash verify caught it, as designed. Fix:
   capture the replacement in a shell variable (trailing-newline-safe via an `x` sentinel), then
   `printf '%s' > target` — still an in-place redirect, still no temp file, no rename. A NUL guard
   on the scaffold source was added so the variable capture is provably byte-exact (project-side
   NUL is already excluded by the R1 fix + eligibility). Mechanical, in-plan; posthash verification
   still stands behind it.
2. **Apply's eligibility re-check re-runs `check.sh` rather than duplicating classification.** The
   plan's apply chain (§1 a–e) does not name an eligibility step, but its own test §6.3 requires a
   forged owner-edited item to be "refused (re-verification catches it)" — only a fresh
   classification can do that (a forger controls both hashes). Re-running check.sh keeps
   classification single-sourced (the alternative — duplicating manifest/installed-hash logic into
   repair.sh — widens the mirror-rot surface the plan explicitly capped). Refusals name the actual
   fresh outcome (`refused: not-repair-eligible … classifies 'owner-edited' right now`).
3. **A light spec-table parse (~15 lines of the pinned awk) is duplicated into repair.sh** beyond
   the plan's named duplication set (do_sha, marker_lines, share/root resolution): synthesis must
   know a path's class (root context file vs reference file) to pick whole-file vs marker-merge.
   Deriving it from "not under ai-agents/" would encode an assumption the spec doesn't promise.
   The behavioral bridge fixture (apply → check → conforming) guards both duplications.
4. **Freshness fixture shape (test-side):** a plain owner-edit after propose is refused by the
   *eligibility* re-check (correct, but it would mask the freshness gate), so the fixture
   CRLF-izes the file instead — classification stays `untouched-stale`, only the raw bytes moved —
   hitting `refused: changed-since-propose` precisely, per the plan's §6.2 wording.
5. **NUL schema.md consequence (stated, not decided):** the R1 guard sits in `content_verdict`, so
   a NUL-bearing `ai-agents/wiki-vault/schema.md` now reports `wiki-routed` with "unreadable" in
   the detail (previously it hashed). No vocabulary change; the vault stays report-only either way.
6. **Raw NUL bytes in test fixtures are written via `\u0000` escapes**, not literal bytes in the
   source (two were initially embedded literally and replaced — an invisible NUL in a .js source
   is a trap for every future editor).

Out-of-scope items deliberately NOT taken: no scaffold edit (R10 → task 0250), no manifest regen,
no launcher/init change, no `parse_tables` edit (R4 dormant), no `test/skill-frontmatter.test.js`
edit (R11 clause did not fire), no commit, no task-file move, no wiki write.

## Review round 1 — fixes applied (2026-08-07, Process-review worker under the standing approval)

Reviewer round 1 (R1–R8, `review.md`) processed per `fkit-process-stateful-review`; all fixes
below were **owner-ruled** (four AskUserQuestion rulings, live lead session, 2026-08-07 — relayed
verbatim into the ledger's Coder response preamble) and applied under the sprint-loop's standing
approval. Files touched: `claude/skills/fkit-heal/repair.sh` (fixes), `test/structure-repair.test.js`
(+4 pins, red-first). No other file changed; `check.sh`, `SKILL.md` untouched this round (SKILL.md
names the freshness re-check generically — still true after the reorder; verified by grep, not
assumed).

**Red-first probes (all four recorded before any fix landed):**
- **R2** hardlink fixture vs pre-fix script: apply **rc 0**, co-linked twin silently rewritten —
  the reviewer's probe reproduced. Post-fix: `refused: hardlink`, twin and target byte-unchanged.
- **R1** cat-shim read-injection (tamper the 3rd targeted scaffold read — the old shape's
  unverified write-buffer read): pre-fix **tampered bytes written**, `error: verify-failed` only
  after the fact. Post-fix: never reachable (buffer hashed pre-write); buffer-tamper scenario
  refuses `replacement-drifted`, nothing written.
- **R5** diff-shim rc 2: pre-fix both item lines **stood approveable with no rendered diff**
  (stderr-only warn). Post-fix: both retracted `# excluded: … diff failed (rc 2)`.
- **R7** interrupt fixture vs pre-fix script: the write-sequence sentinel is **unreachable** (no
  trap, no gauntlet — a signal dies silently). Post-fix: process-group SIGTERM mid-gauntlet →
  "INTERRUPTED while applying <path>" on stderr, exit nonzero.

**Decision log (ADR-019/ADR-032 audit obligation — this round's unattended calls):**

7. **R1+R6 (answers findings R1, R6; ruling 1 + ruling 4):** apply synthesizes ONCE into the
   write buffer and hashes that exact buffer against the approved posthash before the redirect
   (`bufsha` gate); the old separate `synth_sha` pass is gone — hashing one synthesis and writing
   another was the whole defect. R6's lost-rc exposure closes with the same gate (ruled fold; no
   per-stage rc checks, no `set -o pipefail` introduced). Qualified: verified-CORRECT (red
   probe), mechanical/localized, inside ruling 1.
8. **R2 (answers R2; ruling 1):** `find "$root/$p" -maxdepth 0 -links +1` refusal
   (`refused: hardlink`) in the last-instant gauntlet — portable (POSIX find), and placed at the
   write instant so the TOCTOU window is minimal. Qualified: verified-CORRECT (red probe),
   mechanical/localized, inside ruling 1.
9. **R3 (answers R3; ruling 2):** the `[-L]` ancestor walk re-runs immediately before the
   redirect. **Obvious-winner call within intent:** the walk was factored into a
   `first_symlink_component` helper used by both (b) and the gauntlet, instead of duplicating 13
   lines of just-reviewed code that could then drift apart — behavior byte-identical at (b), and
   the existing post-propose symlink test plus the new gauntlet ordering pin both hold.
   Qualified: verified-CORRECT, mechanical/localized, inside ruling 2.
10. **R4 (answers R4; ruling 2):** final on-disk re-hash vs prehash as the LAST act before the
    redirect; the ruled sequence buffer → verify buffer → re-hash disk → write is implemented
    verbatim. **Obvious-winner call within intent, stated in the ledger row too:** the original
    early freshness check (d) is KEPT in addition — removing it would announce a
    propose-to-apply marker-region edit as `replacement-drifted` (blaming the share) instead of
    `changed-since-propose`; keeping it is strictly additive defense with truthful refusal
    reasons. Nothing ruled was removed or reordered away. Qualified: verified-CORRECT,
    mechanical/localized, inside ruling 2's intent.
11. **R5 (answers R5; ruling 3):** the diff is buffered (fixed-width `x%03d` rc sentinel — rc
    carried through the substitution, trailing bytes exact, both inputs proven NUL-free) and
    checked BEFORE the item line is emitted; rc > 1 retracts the item as `# excluded:`.
    **Obvious-winner call within intent:** the all-excluded footer now says `# nothing
    proposable: N repair-eligible row(s) were all excluded` — the old unconditional `# nothing
    repair-eligible: no untouched-stale rows` would have become a false statement on that path
    (init's reporting bar). The finding's optional same-buffer-diff hardening NOT taken
    (minimality; apply's dual verification covers that seam, per the reviewer's own trace).
    Qualified: verified-CORRECT (red probe), mechanical/localized, inside ruling 3.
12. **R7 (answers R7; ruling 3):** `trap on_interrupt INT TERM HUP` in apply — names the
    in-flight path on stderr, exits 1; `$inflight` spans from a fully-guarded item entering its
    write sequence to its announce line. Test-side obvious-winner: the deterministic fixture
    shims the gauntlet's `find` (the only `find` in the whole flow — check.sh runs none, verified
    by grep) to block pre-write, then SIGTERMs the process GROUP as a real Ctrl-C would; a
    timing-based kill would have been flaky, a token-grep pin would have been fence-shaped.
    Qualified: verified-CORRECT, mechanical/localized, inside ruling 3.
13. **R8 (answers R8; ruling 4):** no code change — recorded as an accepted residual with a
    re-raise clause (fence extended only when a write-capable token is introduced, or a general
    write-audit lands). R3/R4 irreducible cores likewise recorded with the ruled verbatim clause.

**Verification after fixes:** `test/structure-repair.test.js` **20/20** (16 + 4 new pins),
`test/structure-check.test.js` **28/28**, full suite `node --test test/*.test.js` foreground →
**668 tests, 668 pass, 0 fail** (was 664). E2e smoke re-run (the guard chain changed materially):
drifted fixture → propose (2 items + 2 diffs, rc 0) → apply (2 applied, rc 0) → re-check
**conforming, rc 0**, both files byte-equal to the scaffold. Fence pins (no rm/mv/unlink/rmdir;
exactly one `> "$root/` redirect; no mktemp, no `>>`) hold over the edited script (suite-verified).
No commit made this round.
