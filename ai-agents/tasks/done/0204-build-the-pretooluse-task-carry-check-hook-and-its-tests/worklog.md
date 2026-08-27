# Worklog — 0204

**Task:** build the `PreToolUse`/`Agent` carry-check hook, its tests and prove-red mutations, and remove
`0203`'s `unverified` marker from `claude/skills/fkit-sprint-ship-loop/SKILL.md` in the same change.
**Driven by:** `fkit-sprint-ship-loop` Build worker (spawned `@fkit-coder`), under the declared-approval
marker. **Plan:** `plan.md` in this folder, blob `b65d36ab28bea8f30236be9596f293c294beffd6` — re-hashed at
Build start and confirmed before any edit. **Date:** 2026-08-25.

## Step 0 — coordinates re-verified live

- `0202` and `0223` both under `ai-agents/tasks/done/` (the board's "0223 before 0204" rule is satisfied).
- Marker sites re-derived from the live file with `grep -n -i 'unverified\|0204'` — the plan's snapshot
  line numbers matched HEAD `493cecd` exactly (`:194`, `:196-200`, `:201-211`, `:247-248`).
- `git status` at start: only the driver's two board/brief files plus the untracked `plan.md`.
- Brief caveat 5 re-verified: no `.claude/settings.json`; `.claude/settings.local.json` has no `hooks` key.
- `node v24.13.0`, `git 2.50.1` on PATH.

## §4 provenance — confirmed against the docs (one hop, `claude-code-guide`)

- `tool_name` is delivered as **`"Agent"`** since Claude Code 2.1.63 (`Task` was renamed; the old name
  still works as an alias in matchers). `"Agent|Task"` is a valid regex matcher — kept as the plan wrote
  it, so both names match.
- `tool_input.prompt`, `tool_input.description`, `tool_input.subagent_type` — as assumed.
- Top-level `cwd` present; deny shape `hookSpecificOutput.{hookEventName:'PreToolUse',
  permissionDecision:'deny', permissionDecisionReason}` with exit 0 — as assumed.
- **No field or matcher adaptation was needed.** The hook self-checks `tool_name ∈ {Agent, Task}`.

## What changed

| File | Change |
|---|---|
| `claude/carry-check-hook.sh` | NEW. Wrapper: `set -u`, `node` missing → allow + loud stderr (Q3), else `exec node "$here/carry-check-hook.mjs"` (stdin untouched; `.mjs` resolved beside itself so prove-red's copied tree runs the copy). |
| `claude/carry-check-hook.mjs` | NEW. The check; node built-ins only (`fs`, `path`, `crypto`). Header states, in order: proxy-not-(b), TOCTOU, launcher-only, the ungated limit, fail-open policy, why the siblings' quoted-run extraction was not copied. |
| `claude/fkit-claude.sh` | `build_settings()`: third `PreToolUse` entry `{"matcher":"Agent|Task", … "bash \"$here/carry-check-hook.sh\""}` for every role, plus a comment block restating the three limits one line each. |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | Marker removal, five sites, deletions only apart from site 4 (below). |
| `test/launcher-contract.test.js` | Test 8: three `PreToolUse` entries, the new one found by `matcher === 'Agent|Task'`; test 10: the script exists; test 11: the inline read-only fallback carries it. |
| `test/carry-check-hook.test.js` | NEW. 19 tests (the plan's 15, plus the four listed in the decision log). |
| `test/prove-red.sh` | `run_carry_check_suite()` (seam `FKIT_CARRY_CHECK_HOOK`), baseline `0l`, mutations 23 and 24 with two-way isolation checks; index header `TWENTY-TWO` → `TWENTY-FOUR` and rows 23/24. |

**Not touched:** `claude/fkit-claude-init.sh`, `claude/README.md`, `claude/agents/fkit-coder.md`,
condition (b)'s wording, `0203`'s rule text (paste-and-pointer construction, degraded form, step ordering),
`package.json`, `ai-agents/wiki-vault/`, `plan.md`, the `.claude/` copies (not refreshed — nothing needed
it for the tests).

## Check semantics as shipped

1. stdin → `JSON.parse`. Unreadable / not JSON / not an object (arrays included) → **allow + stderr**
   `carry-check-hook: … — carry check SKIPPED (fail-open)` (Q3).
2. `tool_name` ∉ {`Agent`, `Task`} → allow. `tool_input.prompt` not a string → allow.
3. Pointer lines: `^[ \t]*plan:[ \t]+(\S+\/plan\.md)[ \t]+blob[ \t]+([0-9a-f]{7,64})\b` per line. Zero →
   **allow, ungated** (Q1). The SKILL.md example `blob c0ffee…` is not ≥7 hex and never matches.
4. No `cwd` on a gated spawn → deny.
5. Pass 1, every pointer: path safety (relative, no `..`, no empty segment, resolves under `cwd`) → exists
   (ENOENT/EISDIR/ENOTDIR = `dangling pointer`) → `sha1("blob <len>\0" + bytes)` must **start with** the
   named hash (Q4).
6. Degraded-form declaration: `/by reference only|pointer[- ]only/i` (Q2) — **scanned over the prompt
   minus every line that is a line of a pointed-to file** (see decision log D1).
7. Pass 2, every pointer, unless declared: `prompt.includes(fileBytes as utf8)` — whole file, every byte,
   in order → else deny.
8. Deny = stderr `carry-check-hook: DENY — <reason>` + the JSON route on stdout, exit 0 (ADR-018 D3).
   Allow = exit 0, empty stdout.

A declared pointer-only spawn with a matching hash is **allowed** — the hook does not enforce condition
(b); the spawned coder's mandatory refusal (SKILL.md step 5) remains the mechanism, until `0333`.

## ⚠️ The five caveats — carried unsoftened

1. **Proxy, never (b).** The hook establishes one thing: *the prompt contains the bytes of the file at P
   whose blob id starts with H*. It can never establish that P is what the owner approved — approval lives
   in a session channel that leaves no artifact (ADR-021). **A green check does not mean the marker held.**
   Conditions (a) and (c) remain forgeable prose; the conjunctive marker is only as strong as its weakest
   signal. **This does not close the `carried-not-approved` residual.** Stated in the `.mjs` header, the
   `.sh` header, the `build_settings()` comment, and the test file header.
2. **Hard-gated on `0202`** — discharged (`0202` in `done/`); a missing `plan.md` is a loud `dangling
   pointer` deny, never a silent pass (tested).
3. **TOCTOU.** `plan.md` is read once, at spawn time. It may be rewritten between that read and the
   worker's use of the carried text. Nowhere is the hook described as guaranteeing what the worker
   *received* — only what the prompt *contained* when the spawn was requested.
4. **Real JSON parsing.** `JSON.parse` in node; the siblings' quoted-run `grep -o` extractor was
   deliberately not copied (stated in both headers). `grep -n '"\[^"\]\*"' claude/carry-check-hook.*` →
   0 hits. No devDependency (ADR-014); `git diff package.json` empty.
5. **Launcher sessions only.** Registered via `build_settings()` into `.fkit/settings/<role>.json`.
   Re-verified this turn: no `.claude/settings.json`; `settings.local.json` has no `hooks` key. A spawned
   or non-launcher session is not covered; the hook is not universal.

**Two further limits recorded (plan §2):** a Build spawn that omits the pointer line entirely is invisible
(ungated) — closing that needs a machine-readable step marker in the driver's rule text, out of scope; and
an infrastructure fault (no `node`, unparseable payload) degrades the proxy to nothing — silently to the
model, loudly on stderr to a human (Q3).

## ⚠️ Relaunch note (as `0202` recorded)

`.fkit/settings/*.json` is gitignored and regenerated on every launch. **No session gets the hook until
its next `fkit <role>` launch.** The lead session driving this sprint loop does not have it now.

## Step 4 — marker removal, site by site (`git diff -U0`, deletions only except site 4)

| Site | Result |
|---|---|
| 1 | `-           — unverified — no hook checks it until 0204's carry-check hook lands` (the fenced form is now the single `plan: … blob c0ffee… (git hash-object)` line) |
| 2+3 | the whole ⚠️ paragraph `⚠️ **Emit that \`unverified — …\` text every time** … mistake it for a checked one.` — 5 lines deleted |
| 5 | the ⛔ `**Who removes this marker, and when …**` paragraph plus its 1–5 list — 14 lines deleted, last |
| **4 ⛔** | exactly two lines in the "honest bound" paragraph: `-  … notice a divergence —` / `-  and until \`0204\`'s carry-check hook lands, nothing does. **This construction` → `+  … notice a divergence.` / `+  **This construction`. No re-flow; *"narrows the hazard; it does not remove it"* untouched. |

Post-checks: `grep -c 0204 SKILL.md` → **0**; `grep -n -i unverified` → only `:285` *"must not carry an
unverified one across several tasks"* (the roll-up sense — kept); `git diff --stat` → `2 insertions(+),
22 deletions(-)` — the two insertions are site 4's replacement lines. No replacement sentence added.

## Tests and verification

- `node --test test/carry-check-hook.test.js` → **19 tests, 19 pass, 0 fail, 0 skipped**. The fixture's
  blob id is computed in the test with `crypto` and cross-checked against `git hash-object --stdin`.
- `node --test test/*.test.js` → **766 tests, 24 suites, 766 pass, 0 fail, 0 cancelled, 0 skipped**
  (765 before the D1 regression test was added; that run was also fully green).
- `bash test/prove-red.sh` → **`✓ hard gate PASSED`**: baselines `0a`–`0l` all green (12), mutations
  1–24 all red at their named assertion (24). Mutation 23 (paste check → always true) reds
  `truncated paste -> deny` while `named hash does not match the file -> deny` stays green; mutation 24
  (hash comparison → always true) reds the hash assertion while the truncated-paste one stays green.
- Smoke run against the **real** `0204/plan.md` at blob `b65d36ab…`: whole paste → allow; last 200 bytes
  cut → `DENY — prompt does not contain the exact bytes of …/plan.md (…)`. (This smoke run is what
  surfaced D1.)
- Brief verification steps: (1) five caveats — in `plan.md` §3 and above; (2) literal grep → 0 hits;
  (3) counts above; (4) `package.json` unchanged; (5) limits in both headers; (6) `git status` confined to
  `claude/` + `test/` plus the driver's board/brief/`plan.md` entries and this worklog; (7) above.

## Decision log — fixes applied without asking / obvious-winner calls (ADR-019 audit obligation)

- **D1 — the degraded-form declaration is scanned outside the pasted file's own lines** (obvious winner
  within the plan's intent; **flagged for the driver to relay — overrule is cheap**). Plan step 5 wrote
  `declared = /…/i.test(p)` over the whole prompt. The smoke run against the real 0204 `plan.md` showed
  that plan says `pointer-only` seven times, so a **truncated** paste of it was **allowed** — the plan's
  own words declared the degraded form on the driver's behalf, defeating Q2's intent (the declaration is
  the driver's statement, SKILL.md step 5). Options weighed: (a) keep as planned — ships a demonstrated
  hole on this task's own plan; (b) require the declaration on/near the pointer line — enforces a
  location the rule text does not state, i.e. the rule-text edit Q2 ruled out, and "near" can still
  reach into the paste; (c) subtract every line of each pointed-to file from the text scanned for the
  declaration — keeps Q1–Q4 intact, no rule-text edit, one function. (c) dominates. Change: two-pass
  loop in the `.mjs` (resolve/read/hash all pointers, then compute `declared` over `prompt` minus file
  lines, then paste checks); regression test *"the plan's own words cannot declare the degraded form"*.
  Residual, stated in the code: a **re-rendered** (not merely cut) plan line carrying the words still
  counts as a declaration.
- **D2 — arrays are "not a JSON object"** (verified-`CORRECT`, mechanical, in-plan Q3). `[1,2]` parsed
  fine and fell to the silent `tool_name` allow; the skip now also covers `Array.isArray`, so a
  non-object payload is loud on stderr as Q3 requires.
- **D3 — launcher-contract tests 10 and 11 extended, not only test 8** (obvious winner within intent —
  the plan's own words are "mirroring how the existing marker hooks are registered"; every sibling is
  pinned in all three). Two assertion lines each.
- **D4 — four tests beyond the plan's fifteen**, all from the plan's own §2 edge cases: `gated spawn with
  no cwd -> deny`; `trailing newline … trimmed paste -> deny` (which also records that an END fence on
  its own line re-supplies the newline — the `.mjs` comment was corrected to say so rather than
  overstate); `tool_name "Task"` (legacy alias) gated alongside `Agent`; and D1's regression test.
- **D5 — comment wording avoids the literal `"[^"]*"`** so the brief's verification grep is a clean 0;
  the point (quoted-run extraction not copied) is stated in words.

No fix was applied that changes what the check *means* beyond D1; every other item is a test-side or
wording correction. No frontier-move, no scope widening, no rule-text edit.

## Flags for the producer / driver

- `0333` expects to re-derive the five-site marker list; with 0204 landed, its step 5 is a no-op it must
  notice (plan §2, last bullet).
- `claude/README.md` does not yet list the new hook (candidate follow-up, per the plan's "not touched").

## Process-review — Round 1 (2026-08-26, `fkit-sprint-ship-loop` Process-review worker, spawned `@fkit-coder`)

Plan re-hashed at start: `git hash-object plan.md` = `b65d36ab28bea8f30236be9596f293c294beffd6` — matches.
Method: `fkit-process-stateful-review` steps 0–7, per-round gate replaced by the standing approval (ADR-032
Decision 3 / ADR-019 discipline). Owner rulings relayed by the driver (2026-08-26): D1 keep as shipped; R1
"Prefix lines count as file content"; "Fix R3+R7, residuals for R2/R5/R6"; R4 no ruling (method applied).
Every finding was reproduced against the shipped hook before any edit (R1 both shapes, R2 symlink, R3 all
four shapes, R7); R6's pipe premise was checked empirically (64 KiB cut on this macOS; `writeSync` none).

**Ledger:** seven *Coder response* rows written (R1 ✅, R2 residual, R3 ✅, R4 ✅, R5 residual, R6 residual,
R7 ✅); three *Accepted residuals* entries (R2, R5, R6) in full What / Why / Re-raise shape; header
`Status: closed-out`. *Reviewer findings* untouched.

**Code changed:**
- `claude/carry-check-hook.mjs` — gate section rewritten as one line loop (`POINTER` per line, non-global;
  `NEAR_MISS` warning, R3); pass 1 records outcomes without denying; pass 1b computes the GATED set (R7);
  denial in prompt order over gated pointers only; `isFileContent()` with `PREFIX_MIN = 12` (R1); the D1
  comment rewritten with the true residual; THE UNGATED LIMIT paragraph mentions the warning. The two
  prove-red target lines (`function hashMatches…`, `function containsExactBytes…`) are byte-unchanged.
- `test/carry-check-hook.test.js` — `assertAllow` asserts no `SKIPPED` on stderr; new `assertSkip` used by
  the malformed-JSON test (R4); three new tests (R1, R3, R7). 22 tests.
- Not touched: `carry-check-hook.sh`, `fkit-claude.sh`, `SKILL.md`, `launcher-contract.test.js`,
  `prove-red.sh` (mutations 23/24 still match their target lines), `plan.md`, `package.json`, wiki.

**Why `PREFIX_MIN = 12`.** The rule exists so a paste cut mid-line cannot leave a partial line that carries a
Q2 literal and is scanned as driver text. The shortest literals are `pointer only` and `pointer-only` (12
chars; `by reference only` is 17). A partial line shorter than 12 chars cannot contain any literal, so it
needs no rule; every partial line of ≥12 chars that is a prefix of a file line is caught. 12 is therefore
the floor the ruling set (≥ the shortest literal) and also sufficient — a larger N would let a partial
line of length 12..N-1 ending in `pointer-only` self-declare again. Failure direction of a false positive
(a driver line that happens to be a ≥12-char prefix of a plan line): the declaration is missed → deny →
re-spawn; never an allow.

**Tests:** `node --test test/carry-check-hook.test.js` → 22/22. `node --test test/*.test.js` → **769 tests,
24 suites, 769 pass, 0 fail, 0 cancelled, 0 skipped** (766 before this round + 3). `bash test/prove-red.sh`
→ `✓ hard gate PASSED`: baselines 0a–0l green (12), mutations 1–24 red at their named assertion (24);
23 reds `truncated paste -> deny` with the hash assertion green, 24 reds `named hash does not match the
file -> deny` with the truncated-paste assertion green — the gate's own isolation greps enforce this.
Brief checks re-run: `grep -n '"[^"]*"' claude/carry-check-hook.*` → 0 hits; `git diff package.json` → empty.

**Residuals surfaced this round that are NOT yet in *Accepted residuals* (need owner OK to record):**
1. R1 leftover — a partial file line with driver text glued after the cut on the SAME line (END fence not
   on its own line) is neither a file line nor a prefix of one; it still counts as driver text. The ship
   loop's fence is on its own line, so the tool-cap tail-cut shape is covered. Stated in the `.mjs`.
2. R7 leftover — the line-set narrowing cannot tell where a line sits: a driver-text pointer line that is
   byte-identical to a line of a pasted plan is content and is not gated. Pinned by a test as the
   documented behaviour.
3. R3 — the SKILL.md example line (`plan: …/plan.md  blob c0ffee…`) quoted in a prompt now draws the
   near-miss WARNING (still allow — the existing `example form` case in the *no pointer line* test
   exercises exactly this and stays green). Harmless noise on stderr, by design: a human sees the line was
   looked at and not gated.

### Decision log — fixes applied without asking / obvious-winner calls (ADR-019 audit obligation)

- **R1** — ruled by the owner (not unattended). Changed: `isFileContent()` + `PREFIX_MIN` in the `.mjs`;
  comment at old `:128` corrected; regression test with the cut immediately after the words. Qualified as:
  owner-ruled shape, in-plan (step 5's declared-form detection, D1 kept).
- **R3** — ruled by the owner. Changed: `NEAR_MISS` scan + one stderr WARNING line, decision unchanged;
  test pins four shapes and the no-warning case. Qualified as: owner-ruled, localized, allow path unchanged.
- **R7** — ruled by the owner. Changed: pass 1 / pass 1b split, gated-set computation, deny order preserved;
  test pins allow, the two still-denying cases, the cut-inside-pointer fail-closed case, and the
  byte-identical-line residual. Qualified as: owner-ruled shape ("narrow via the D1 line set"). The
  mutual-quote guard (one clause) is an obvious-winner-within-intent: it keeps the fail-closed side of the
  ruled shape and is otherwise unreachable.
- **R4** — **applied without a ruling** under the standing approval. Answers: R4 (allow tests cannot tell
  allow from skip). Changed: `assertAllow` + `assertSkip` in the test file only. Qualified as:
  verified-CORRECT (read `:85-88`; a skip and an allow were identical to it), mechanical/localized
  (test helper, no hook change), inside the approved plan (step 5 defines `assertAllow`'s contract; this
  strengthens it without changing the hook's meaning).
- Obvious-winner calls beyond the above: **none**.

## Process-review — Round 2 (2026-08-26, `fkit-sprint-ship-loop` Process-review worker, spawned `@fkit-coder`)

Plan re-hashed at start: `git hash-object plan.md` = `b65d36ab28bea8f30236be9596f293c294beffd6` — matches.
Method: `fkit-process-stateful-review` steps 0–7, per-round gate replaced by the standing approval (ADR-032
Decision 3 / ADR-019 discipline). Owner rulings relayed by the driver (2026-08-26): R1 leftover → residual
(widened per R13); R7 leftover / R9 → residual, widened wording + pinned test; R3 noise → accept as-is; R8,
R10, R11, R12 → no ruling (method applied under the standing approval). Every finding was reproduced against
the shipped hook before any edit (R8 three shapes, R9 with both controls, R10 by the `PREFIX_MIN = 13`
mutant, R11, R12 by the guard-removed mutant AND by running the nonce search, R13 both shapes).

**Ledger:** six *Coder response* rows written (R8 ✅, R9 residual, R10 ✅, R11 ✅, R12 ✅, R13 residual);
three *Accepted residuals* entries added (R1/R13, R7/R9, R3-noise) in full What / Why / Re-raise shape;
Round 2 loop-check paragraph added. *Reviewer findings* untouched. Header set to `Status: closed-out`.

**Code changed:**
- `claude/carry-check-hook.mjs` — (R8) `fileLines` built from every readable pointer file (`pointers` with
  `bytes`), not from the gated set; (R11) the near-miss WARNING moved into `warnNearMisses()`, emitted on
  the zero-pointer path for every near-miss (unchanged behaviour) and, on the gated path, after pass 1 has
  read the files with `isFileContent` lines excluded — before pass 1b's deny loop, so a deny still carries
  it; (R12) pass-1b comment rewritten to "not reachable by accident; reachable deliberately (~2^28 nonce
  search)"; (R9/R13) the two residual comments widened. The "what counts as file content" block now sits
  before pass 1b (it no longer depends on the gated set). Prove-red target lines `function hashMatches…` and
  `function containsExactBytes…` byte-unchanged.
- `test/carry-check-hook.test.js` — R10: floor cut (a line beginning with `pointer-only`, cut after exactly
  12 chars) added to the R1 test; new tests for R8 (regression), R9 (residual pinned, with both controls),
  R11 (content near-miss silent; driver near-miss still warns, count 1; truncation still denies), R12
  (precomputed self-quoting fixture `blob 03af16b` / nonce 7; asserts the fixture still hashes to its id).
  `twoPlans()` helper. 26 tests.
- Not touched: `carry-check-hook.sh`, `fkit-claude.sh`, `SKILL.md`, `launcher-contract.test.js`,
  `prove-red.sh`, `plan.md`, `package.json`, wiki.

**R12 fixture provenance.** Search script: iterate 7-hex prefixes, for each try nonces 0–63 in the plan
text `# Plan — 0993 … plan: <rel>  blob <hex> (git hash-object) … - step: nonce N`; stop when the blob id
starts with the prefix. Found `hex 03af16b`, `nonce 7`, id `03af16b3fb382ef85adf4513f7c68f0225e76575` after
**170.6 s** on one core — the reviewer's ~3-minute estimate holds. The test does NOT run the search.

**Mutation checks this round (via `FKIT_CARRY_CHECK_HOOK` on copies of the edited hook):**
- `PREFIX_MIN = 13` → Round 1 suite 22/22 (R10 confirmed) → new suite **25/26**, failing at
  `cut leaving exactly \`pointer-only\`` in the R1 test.
- guard clause `&& !(x.lines && x.lines.has(y.line))` removed → Round 1 suite 22/22 (R12 confirmed) → new
  suite **25/26**, failing at `truncated self-quoting plan must still be gated` in the R12 test.

**Tests:** `node --test test/carry-check-hook.test.js` → **26/26**. `node --test test/*.test.js` → **773
tests, 24 suites, 773 pass, 0 fail, 0 cancelled, 0 skipped** (769 after Round 1 + 4).
`bash test/prove-red.sh` → **`✓ hard gate PASSED`**: baselines 0a–0l green (12), mutations 1–24 red at their
named assertion (24). Mutation 23 (paste check → always true) reds `truncated paste -> deny`; mutation 24 (hash
comparison → always true) reds `named hash does not match the file -> deny` — the gate's isolation greps confirm
each stays green under the other. Brief checks re-run: `grep -n '"[^"]*"' claude/carry-check-hook.*` → 0 hits;
`git diff package.json` → empty; `git status` confined to `claude/` + `test/` + this task folder + the driver's
board/brief edits.

### Decision log — fixes applied without asking / obvious-winner calls (ADR-019 audit obligation)

- **R8** — applied without a ruling under the standing approval (the driver's brief: verified defect inside
  the approved scope, fix per the reviewer's recommendation). Answers: R8 (fail-open regression from the R7
  narrowing). Changed: one line in the `.mjs` (`fileLines` source: `files` → `pointers` with `bytes`) plus
  its comment; regression test. Qualified as: verified-CORRECT (reproduced three shapes), mechanical/localized
  (one expression), in-plan (step 5's declared-form detection, D1 kept; widening the subtraction is
  fail-closed-only — regression check run: every prior allow in the suite stays green). Severity derived:
  **medium** (fail-open on the hook's own class, but a three-condition stack; reviewer medium, Codex high).
- **R10** — applied without a ruling. Answers: R10. Changed: the R1 test only (floor cut added). Qualified as:
  verified-CORRECT (`PREFIX_MIN = 13` survived 22/22), mechanical, test-only, in-plan (step 5 tests).
- **R11** — applied without a ruling. Answers: R11 (false WARNING on carried content). Changed: the warning's
  emission point and its input set in the `.mjs`; new test. Qualified as: verified-CORRECT (reproduced),
  mechanical/localized (a function and one filter; decision path untouched), in-plan / not a change of
  ruled behaviour — the R3 ruling asked for the warning on near-miss DRIVER lines; the zero-pointer path
  (where the R3 test and the accepted SKILL.md-example noise live) is byte-for-byte the same output. I
  judged this NOT a `NEEDS-DECISION` because no ruled allow/deny/warning case changes; only lines that
  are provably file content stop being reported. Placement (before pass 1b's deny rather than after it, as
  the reviewer sketched) is an obvious-winner-within-intent: a deny keeps carrying the warning as it did.
- **R12** — applied without a ruling. Answers: R12. Changed: a comment in the `.mjs` and one new test with a
  precomputed fixture. Qualified as: verified-CORRECT (both halves reproduced, incl. the search), no code
  path changed, test-only + wording. Obvious-winner call: precompute the fixture rather than search at test
  time (170 s per run is not a unit test) — the test asserts the fixture's hash so drift is loud.
- **R9 / R13** — owner-ruled residuals; comment wording widened in the `.mjs`; R9 pinned by a test as the
  ruling asked. No unattended fix.
- **R3 noise** — owner-ruled accept-as-is; residual entry recorded. No fix.
- Obvious-winner calls beyond the above: **none**.

## Process-review — Round 3 (2026-08-26, `fkit-sprint-ship-loop` Process-review worker, spawned `@fkit-coder`)

Plan re-hashed at start: `git hash-object plan.md` = `b65d36ab28bea8f30236be9596f293c294beffd6` — matches.
Method: `fkit-process-stateful-review` steps 0–7, per-round gate replaced by the standing approval (ADR-032
Decision 3 / ADR-019 discipline). One novel row, **R14** (low, frontier-move). Owner rulings relayed by the
driver (2026-08-26): R11 "Keep" and R9 "Residual, widened wording + pinned test" — together they settle R14
as the reviewer's option (a): no logic change, widen the R7/R9 residual, pin it. R14 was reproduced against
the shipped hook before any edit: identical driver line → allow + empty stderr; a 47-char prefix of it (ending
at `blob`) → the same; one-byte-different controls → WARNING count 1; the copied line + a truncated carry →
still DENY (the cost is confined to the warning channel).

**Ledger:** R14 *Coder response* row (`won't fix (frontier)`); the R7/R9 residual renamed **R7 / R9 / R14**
and widened with shape (3) + a third re-raise trigger (the WARNING routed to the model or made blocking);
Round 3 loop-check paragraph; the R11 row's "a deny still carries the warning, as before" corrected in place
for the no-`cwd` deny (`:119` precedes the warning — reviewer-noted, not a row; no real path, the harness
always supplies `cwd`). Header set to `Status: closed-out` — nothing remains open. *Reviewer findings*
untouched. The `.mjs` was checked for the "as before" wording: it is not there (only my ledger row said it),
so no `.mjs` correction was needed on that point.

**Code changed:**
- `test/carry-check-hook.test.js` — new test *"a driver near-miss line byte-identical to, or a >=12-char
  prefix of, a content line is silent too (review R14, documented residual)"*: both silent shapes (identical
  line; ≥12-char prefix that still has the near-miss shape), both one-byte controls (warn, count 1), and the
  copied line + truncated carry → deny. 27 tests.
- `claude/carry-check-hook.mjs` — **comment only** (the `warnNearMisses` block): one sentence naming the R14
  residual, mirroring the ledger as the R9/R13 comments do. No logic change; the file's decision paths and
  the two prove-red target lines (`function hashMatches…` `:65`, `function containsExactBytes…` `:69`) are
  byte-unchanged.
- Not touched: `carry-check-hook.sh`, `fkit-claude.sh`, `SKILL.md`, `launcher-contract.test.js`,
  `prove-red.sh`, `plan.md`, `package.json`, wiki.

**Mutation check (via `FKIT_CARRY_CHECK_HOOK` on a copy):** the R11 filter removed
(`warnNearMisses(nearMisses)`) → **25/27**, failing at the R14 test's `residual: the copied identical line
draws no WARNING` and at the R11 test's `must not warn` — the pin is not tautological.

**Tests:** `node --test test/carry-check-hook.test.js` → **27/27**. `node --test test/*.test.js` → **774 tests,
24 suites, 774 pass, 0 fail, 0 cancelled, 0 skipped** (773 after Round 2 + 1). `bash test/prove-red.sh` →
**`✓ hard gate PASSED`**: baselines 0a–0l green (12), mutations 1–24 red at their named assertion (24);
23 reds `truncated paste -> deny`, 24 reds `named hash does not match the file -> deny`. Brief checks re-run:
`grep -n '"[^"]*"' claude/carry-check-hook.*` → 0 hits; `git diff package.json` → empty; `git status`
confined to `claude/` + `test/` + this task folder + the driver's board/brief edits.

### Decision log — fixes applied without asking / obvious-winner calls (ADR-019 audit obligation)

- **R14** — owner-ruled disposition (option (a) follows from the relayed R11 "Keep" + R9 "Residual, widened
  wording + pinned test" rulings). Changed: the residual entry, the R14 row, the pin test. No unattended fix.
- **Obvious-winner call — the one-sentence `.mjs` comment** naming R14 beside the R11 exclusion. Qualified
  as: obvious-winner-within-intent — the reviewer's R14 row says the R11 comment "does not name it", and the
  Round 2 precedent (R9/R13) mirrored each residual's wording into the `.mjs`; comment-only, no logic, no
  decision path. Reversal is a one-line delete.
- **Obvious-winner call — correcting my own R11 row's "as before"** for the no-`cwd` deny the reviewer noted.
  Qualified as: my own section, an accuracy fix of a claim I wrote, no code.
- Fixes applied without asking beyond the above: **none**.
