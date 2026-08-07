# Review — 0245

Task: ai-agents/tasks/done/0245-build-the-producer-owned-structure-check-skill/brief.md
File(s) under review: claude/skills/fkit-heal/check.sh (NEW), claude/skills/fkit-heal/SKILL.md (NEW),
test/structure-check.test.js (NEW), claude/skills-for-role.sh, test/skill-ownership-hook.test.js,
test/skill-frontmatter.test.js, claude/skills/fkit-team/SKILL.md, claude/README.md,
claude/scaffold/CLAUDE.md, ai-agents/knowledge-base/architecture.md, claude/agents/fkit-producer.md,
claude/structure-spec.md (§"Project root" amendment), claude/structure-manifest.tsv (regen)
(context: plan.md, brief.md, worklog.md; bin/generate-structure-manifest.mjs as the parity contract)
Status: closed-out

*Round 1 (2026-08-07). Reviewers run: fkit-reviewer own pass + Codex adversarial pass
(`codex exec --sandbox read-only`) — full coverage, both completed. Every row below was verified
against the code; R1/R3/R8 additionally reproduced live. Codex findings #2 and #8 were re-derived:
#2 recorded as R2 (PARTIALLY CORRECT — parity IS pinned for whole-file and CRLF paths via the
manifest-matched fixtures; the ELISION path is the uncovered one), #8 DISPROVEN as a defect (see
notes under the table).*

*Round 2 (reviewer re-verify, 2026-08-07): R2 fix verified in code AND independently re-proven —
the new fixture (test/structure-check.test.js:220-242) selects the oldest marker-bearing shipped
`claude/scaffold/CLAUDE.md` (non-vacuity asserted both ways), and my own probe confirms: unmutated
`check.sh` classifies it `untouched-stale` (bash elision reproduces the JS-elided manifest row);
under a transient one-boundary elision mutation applied to a SCRATCHPAD COPY (`i > lb` → `i >= lb`;
source untouched), the same fixture flips to `owner-edited` (the assertion reds) while a
scaffold-verbatim fresh project stays all-conforming/exit 0 — exactly R2's claim, now red-capable.
Header rewrite verified (lines 17-24 correctly relocate the parity pin to the manifest-matched
fixtures). R9 fold-in verified (log.md written + asserted, lines 383-388). Suite re-run under my
own hand: 24/24; `check.sh:202` elision line byte-unchanged. Residual records spot-checked: R1
carries the owner's ruling-1 clause verbatim ("MUST be resolved before 0246 gates a write on
untouched-stale"); R3–R8 + R11 recorded with full What/Why/Re-raise structure; worklog calls 2+6
ratified per ruling 4. One vocabulary note, not a reopen: R10's status "routed (new task)" sits
outside the schema's listed status set — annotated to owner ruling 3 and traceable, accepted as
recorded. No new findings. **Closed-out status CONFIRMED.***

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | med | claude/skills/fkit-heal/check.sh:195-208 | bash↔JS hash parity breaks on NUL bytes: macOS awk truncates a record at `\0` (reproduced: `keep\0hidden-edit` hashes as `keep`), JS `hashFor` hashes raw bytes — an owner edit appended after a NUL on an existing line classifies **conforming/untouched-stale** instead of owner-edited. Wrong-direction failure: report-only today, but untouched-stale is exactly what 0246's consent gate will treat as safe-to-replace. Exotic input (NUL in markdown), real mechanism. [Codex #1; probe-verified] |
| R2 | 1 | med | test/structure-check.test.js:17-21,124-139 + check.sh:308-312 | The **elision-path** bash↔JS parity is pinned by NO test, and the fresh-conforming header's claim ("transitively pins parity… only passes if check.sh reproduces hashFor for every scaffold file") is false: conforming short-circuits on `installed_hash` (bash vs bash — an identically wrong transform on both sides stays green; the manifest is never consulted). Whole-file and CRLF parity ARE pinned (manifest-matched fixtures: generic README, omnigent CLAUDE.md), but no marker-BEARING file is ever required to match a JS-produced manifest row — the plan's named top risk (§8) is covered only by the worklog's one-off manual probe. Fix shape: an `oldestShipped('claude/scaffold/CLAUDE.md')` untouched-stale fixture (markers present, must match the JS-elided manifest hash) + correct the header comment. [Codex #2, re-derived; verified] |
| R3 | 1 | low | claude/skills/fkit-heal/check.sh:161-177 vs 349 | A symlinked `ai-agents/` has its `.fkit-keep-out` probed and read **through the link** before any `-L` test (reproduced: foreign unreadable keep-out behind the link → report shows the fail-closed keep-out diagnosis, never `refused: symlink`; a readable foreign keep-out's entries shape child-row outcomes). Init does the top-level `-L` preflight first; the script's own header claims "[-L] FIRST, ALWAYS". Read-only, so no write risk — a diagnosis/consistency defect. [both reviewers; probe-verified] |
| R4 | 1 | low | claude/skills/fkit-heal/check.sh:129-145 | `parse_tables` refuses only on missing headings / zero TOTAL rows / unknown class: a corrupted share spec keeping both headings but losing ALL of one table's rows runs silently with narrowed coverage (can exit 0 checking no files). Hardening: count Table A and Table B rows separately, refuse if either is 0. Field-corruption-only (repo-side, EXPECTED_ROWS=48 and test/structure-spec.test.js pin it; install refreshes spec+scaffold wholesale). [Codex #4; code-verified] |
| R5 | 1 | low | claude/skills/fkit-heal/check.sh:134-143,322-325 | Parsed spec paths are never validated project-relative — a `../../…` row escapes `$root` (read/hash outside the project, report-only). The share is trusted fkit-authored input, so this is hardening, not a live hole; a one-line reject of `../`-containing / absolute paths closes it. [Codex #5; code-verified] |
| R6 | 1 | low | claude/skills/fkit-heal/check.sh:190-208,297-315 | No pipefail/output guard on the hash pipeline: a present-but-broken sha tool (or mid-file awk failure) yields an empty hash with exit 0 → every content-checked file misreports **owner-edited** instead of `unreadable`. The no-tool case IS handled; this is the broken-tool case. Hardening: require the result to match `^[0-9a-f]{64}$`, else `unreadable`. [Codex #6; mechanics verified] |
| R7 | 1 | low | claude/skills/fkit-heal/check.sh:239-248,308-314 | Missing/malformed share scaffold copy falls through to the manifest, which also carries the CURRENT version → a genuinely current project file labels `untouched-stale` with a detail asserting "matches an older shipped version" (false in that branch). Mitigated: loud once-per-file warn; spec↔scaffold agreement is repo-test-pinned; wholesale share refresh makes the skew field-corruption-only. [Codex #7; code-verified] |
| R8 | 1 | low | claude/skills/fkit-heal/check.sh:224,302-305 | End-before-begin malformation reports "1 begin / 1 end marker line(s)" — counts that look VALID; the actual cause (order) is never named, where the JS twin appends "(end before begin)". Test pins outcome only, so the deficient diagnostic stays green. [both reviewers; probe-verified] |
| R9 | 1 | nit | test/structure-check.test.js:353-359 | "index.md and log.md are existence-only" exercises only index.md; log.md is asserted never. [Codex #10] |
| R10 | 1 | low | claude/scaffold/CLAUDE.md:23 | Producer mirror row omits `/fkit-task-brief` while skills-for-role.sh and the other three mirrors include it. **Pre-existing** (verified against HEAD — predates 0245); surfaced by, not introduced by, this task's edit to the same line. Fixing it means a scaffold edit + manifest regen. [Codex #11; verified pre-existing] |
| R11 | 1 | nit | test/skill-frontmatter.test.js:115-116 | Closed-vocabulary comment still says "across all 25 skills" (and `name`×32/`description`×32 counts) — stale beside the updated EXPECTED_SKILLS=26 pin. Comment-only. [Codex #12; verified] |

**Disproven / not recorded as rows:**
- **Codex #8** (missing/wrong-type wiki-vault files should emit `wiki-routed`, not `missing`/`wrong-type`):
  DISPROVEN as a defect. The brief (item 2) makes wiki-vault rows **existence-only** with `wiki-routed`
  reserved for the `schema.md` content check; the implementation matches, names ADR-005 in every such
  detail line, and the choice is a logged in-plan interpretation call (worklog decision 6). At most an
  owner vocabulary preference — offered as a disposition question below, not a defect.
- **Codex #3 severity note:** raised as High; re-derived to **low** (R3) — the read-through is
  report-shaping only; no write path exists in any branch, and the fail-closed exit stays 1.

**Suppressed as re-litigating settled decisions:** none — Codex respected the primed residuals
(0243-R3 resolved by the ruled amendment this task; 0244-R4/R6 conditions unmet; renamed-dir limit;
kept-out/exit-code and fail-closed-no-rows interpretation calls).

**Worklog audit (the six interpretation calls):** all six verified in-plan; none required escalation.
(1) EXPECTED_SKILLS 25→26 — mechanical, mandated by the pin's own header. (2) kept-out ≠ exit 1 —
consistent with the plan's exit-1 definition ("nonconformities/refusals"; kept-out is recorded
intent), test-pinned, documented. (3) fail-closed keep-out emits no ai-agents rows — mirrors init R1
as the plan directs, documented as the one stated exception, exits 1. (4) child rows under a refused
subtree — init's own subtree rule, test-pinned. (5) CRLF fixture role swap — non-vacuity asserted.
(6) missing wiki files → `missing` — brief-consistent (see Codex #8 above). Calls 2 and 6 are the two
with owner-visible semantics; both are ratifiable below if the owner wants them locked as residuals.

## Coder response

*(coder-owned — written by fkit-process-stateful-review, round 1, 2026-08-07. All dispositions
below execute FOUR OWNER RULINGS relayed verbatim by the fkit-sprint-ship-loop driver from the live
lead session (AskUserQuestion, 2026-08-07): (1) R1 "Residual + clause (Recommended)"; (2) R2–R8
"Fix R2 now, R3–R8 residuals (Recommended)"; (3) R10 "File as own task (Recommended)"; (4) worklog
calls 2 and 6 "Ratify both (Recommended)". Every finding was independently re-verified against the
code before acting; R1 was re-reproduced locally (macOS awk 20200816 truncates `keep\0hidden-edit`
to `keep`), R10 re-confirmed on disk against the three carrying mirrors.)*

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (exotic-input parity break; report-only today, wrong-direction for 0246) | none this task — accepted residual per owner ruling 1, with its re-raise clause verbatim below | won't fix (frontier) |
| R2 | CORRECT | Defect (test gap + false header claim) | `test/structure-check.test.js`: new elision-parity fixture (oldest marker-bearing shipped `claude/scaffold/CLAUDE.md`, elided hash is a JS-produced manifest row → must classify `untouched-stale`) + header rewritten to state where parity is actually pinned. Prove-red done: under a transient one-boundary elision mutation in `check.sh` (`i > lb` → `i >= lb`) ONLY the new fixture reds (23/24) — the fresh-conforming and stuffed-block cases stay green, demonstrating the finding's exact claim; mutation reverted byte-exact (`cmp` clean) | ✅ done |
| R3 | CORRECT | Defect (diagnosis/consistency; read-only, no write risk) | none this task — accepted residual per owner ruling 2 | won't fix (frontier) |
| R4 | CORRECT | Hardening gap (silent narrowed coverage on a field-corrupted spec) | none this task — accepted residual per owner ruling 2 | won't fix (frontier) |
| R5 | CORRECT | Hardening gap (spec-row path escape; share is trusted fkit-authored input) | none this task — accepted residual per owner ruling 2 | won't fix (frontier) |
| R6 | CORRECT | Hardening gap (broken-tool empty hash → mass owner-edited misreport) | none this task — accepted residual per owner ruling 2 | won't fix (frontier) |
| R7 | CORRECT | Defect, mitigated (false "older shipped" detail in the scaffold-absent branch; loud warn present) | none this task — accepted residual per owner ruling 2 | won't fix (frontier) |
| R8 | CORRECT | Defect (deficient diagnostic — order malformation never named; counts read as valid) | none this task — accepted residual per owner ruling 2 | won't fix (frontier) |
| R9 | CORRECT | Nit (vacuous coverage claim for log.md) | folded into R2's edit (2 lines, same file — the spawn's fold-in license; decision-log entry in worklog.md): log.md written + asserted `conforming` | ✅ done |
| R10 | CORRECT | Pre-existing defect (verified: `claude/scaffold/CLAUDE.md:22` producer row omits `/fkit-task-brief`; `skills-for-role.sh:51`, `README.md:47`, `fkit-team/SKILL.md:54` all carry it) | none this task — owner ruling 3: routed to its own task (driver has a producer file the brief); fixing here would mean a scaffold edit + manifest regen outside this round's bounds | routed (new task — status value per owner ruling 3) |
| R11 | CORRECT | Nit (stale comment: "25 skills", ×32 counts; corpus is 26/×33) | none this task — different file from R2's edits, so outside the fold-in license; recorded as residual below | won't fix (frontier) |

**Verification this round:** `node --test test/structure-check.test.js` → **24/24 pass** (was 23; +1
new fixture). Full unit suite `node --test test/*.test.js` → **644 tests, 644 pass, 0 fail, 0
skipped**. Elision-parity fixture proven non-vacuous AND red-capable (transient mutation probe
above). No source file changed except `test/structure-check.test.js`; `check.sh` byte-identical to
its pre-round state.

**Convergence call:** round 1 fully dispositioned under the owner's four rulings — R2+R9 fixed,
R1/R3–R8/R11 accepted residuals, R10 routed out. No oscillation, no re-litigation of 0243/0244
residuals (reviewer honored them; nothing suppressed). Nothing blocking remains in this ledger.

## Accepted residuals (shared, do-not-re-litigate)

- **R1 — NUL-byte bash↔JS hash-parity break** — What: macOS awk truncates records at `\0`, so an
  owner edit appended after a NUL on an existing line can classify `conforming`/`untouched-stale`
  instead of `owner-edited`; accepted as-is for this report-only unit. · Why (structural): exotic
  input (NUL in markdown), real mechanism; fixing in bash means abandoning awk for the transform or
  pre-scanning for NUL — cost not justified while no branch writes. · Re-raise only if — **owner's
  clause, verbatim (ruling 1):** "MUST be resolved before 0246 gates a write on untouched-stale".
- **R3 — keep-out probed through a symlinked `ai-agents/`** — What: `.fkit-keep-out` is probed/read
  before the row loop's `-L` test, so a symlinked `ai-agents/` shows the keep-out diagnosis (or
  takes a foreign keep-out's entries) instead of `refused: symlink`; read-only, exit stays 1. ·
  Why (structural): fixing means hoisting an `ai-agents/` `-L` preflight above the keep-out block;
  deferred with the round's other lows by owner ruling 2. · Re-raise only if: 0246 makes any write
  decision downstream of keep-out contents or of the `ai-agents/` refusal ordering.
- **R4 — `parse_tables` accepts one empty table** — What: a corrupted spec keeping both headings
  but losing all of one table's rows runs with silently narrowed coverage. · Why (structural):
  field-corruption-only; repo-side `EXPECTED_ROWS=48` + `test/structure-spec.test.js` pin it, and
  install refreshes spec wholesale. · Re-raise only if: the spec's pinned table contract changes,
  `parse_tables` is edited, or a field report shows a narrowed run.
- **R5 — spec paths not validated project-relative** — What: a `../`/absolute spec row would
  read/hash outside `$root` (report-only). · Why (structural): the share is trusted fkit-authored
  input; a one-line reject is cheap but deferred with the round by ruling 2. · Re-raise only if:
  0246 derives any write path from a spec row, or the spec ever takes non-fkit-authored input.
- **R6 — no output guard on the hash pipeline** — What: a present-but-broken sha tool yields an
  empty hash with exit 0 → content-checked files misreport `owner-edited` instead of `unreadable`.
  · Why (structural): the no-tool case is handled; the broken-tool case needs a `^[0-9a-f]{64}$`
  guard — deferred by ruling 2. · Re-raise only if: 0246 consumes any classification as a write
  gate (a misclassification would then drive repair proposals), or a field report shows mass
  owner-edited.
- **R7 — scaffold-absent fallthrough mislabels current as `untouched-stale`** — What: with the
  share scaffold copy missing/malformed, a genuinely current file matches the manifest's current
  row and reports "matches an older shipped version" (false in that branch); loud once-per-file
  warn already fires. · Why (structural): spec↔scaffold agreement is repo-test-pinned and install
  refreshes wholesale — field-corruption-only. · Re-raise only if: the R1 clause fires (0246
  gating a write on untouched-stale re-opens this identically) or the scaffold-absent warn path is
  restructured.
- **R8 — end-before-begin diagnostic names counts, not order** — What: the detail reads "1 begin /
  1 end marker line(s)" — valid-looking counts; the JS twin appends "(end before begin)". Outcome
  is correct; only the diagnostic is deficient. · Why (structural): cosmetic in a report-only
  unit; test pins outcome, not detail text. · Re-raise only if: 0246 surfaces the malformed-marker
  detail in a consent prompt (the owner would then act on the wrong cause).
- **R11 — stale closed-vocabulary comment in `test/skill-frontmatter.test.js`** — What: comment
  still says "across all 25 skills" with `name`×32/`description`×32; corpus is 26/×33 since this
  task. Comment-only; the executable pin (`EXPECTED_SKILLS=26`) is correct. · Why (structural):
  outside this round's fold-in license (different file from R2's edits). · Re-raise only if: that
  file is next edited for any reason — fix it in that same change.
- **Owner-ratified semantics (ruling 4, 2026-08-07)** — worklog decision-log calls 2 and 6 are
  ratified, not provisional: **(call 2)** `kept-out` is recorded intent, never exit 1 — a
  deliberately opted-out project exits 0; **(call 6)** missing/wrong-typed wiki-vault files report
  `missing`/`wrong-type` (with ADR-005 in the detail), `wiki-routed` stays reserved for the
  `schema.md` content check. · Re-raise only if: the owner changes the exit-code contract or the
  wiki-vault vocabulary in a later unit (0246/0247) — not as a review finding against this one.
