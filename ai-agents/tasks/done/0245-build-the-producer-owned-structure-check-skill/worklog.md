# Worklog — 0245: the producer-owned structure-check skill (`/fkit-heal`)

**Builder:** fkit-coder, spawned as the `/fkit-sprint-ship-loop` Build worker under the loop's
declared-approval marker (owner approved the plan via `AskUserQuestion` in the live lead session,
2026-08-07; skill name ruled by owner-typed answer **"fkit-heal"**; spec amendment ruled "Amend now";
exit-code contract 0/1/2 accepted with the plan). Plan hash-verified against `plan.md` on start
(`git hash-object` → `63ce79b18cfb66be4535a7d700efe605ba84b9a4`, 18133 bytes — matched the driver's
pin, before any read of the pasted copies).

## What was built

| File | What |
| --- | --- |
| `claude/skills/fkit-heal/check.sh` | NEW — the deterministic bash checker (ADR-017, all four rules; no Node). Reproduces 0244's hashing contract (CRLF→LF ending-aware, root-file marker elision on `marker_lines`' awk contract carried verbatim, sha256 via `sha256sum`→`shasum -a 256` fallback), parses the spec's two pinned inventory tables (refuse-on-skew), applies init's keep-out parser semantics (fail closed), and classifies per the plan-§3 precedence. Read-only in every branch. Exit 0/1/2 per the accepted contract. |
| `claude/skills/fkit-heal/SKILL.md` | NEW — the producer's procedure: run the script, present the report verbatim, diff owner-edited files against the share scaffold, state ADR-005 routing for wiki-routed lines, state the limits; loudly report-only (repair is 0246). |
| `claude/skills-for-role.sh` | EDIT — `fkit-heal` added to the `producer)` line (the single source of truth). |
| `test/skill-ownership-hook.test.js` | EDIT — `fkit-heal` added to `UNIVERSE` and `OWNED.producer`; the matrix now generates producer-allow + deny for all six other roles. |
| `claude/skills/fkit-team/SKILL.md` | EDIT — mirror 1: producer row. |
| `claude/README.md` | EDIT — mirror 2: producer row. |
| `claude/scaffold/CLAUDE.md` | EDIT — mirror 3: producer row (ships into consuming projects). |
| `ai-agents/knowledge-base/architecture.md` | EDIT — mirror 4: producer row + all three "25 skills" count sites → 26 (§1 bullet, §3.1 tree comment, §4.2 heading). |
| `claude/agents/fkit-producer.md` | EDIT — producer prose now names `/fkit-heal` (ADR-036's 0124 failure class: a system prompt must not argue with the hook). |
| `claude/structure-manifest.tsv` | REGENERATED — `npm run generate:manifest` after the scaffold/CLAUDE.md mirror edit; 63 → 64 entries. |
| `claude/structure-spec.md` | EDIT — the ruled amendment: the §"Project root" markers-absent bullet now states the plan-§3 precedence (manifest verdict decides; markerless + matched = untouched-stale). Pinned inventory tables untouched. |
| `test/skill-frontmatter.test.js` | EDIT — `EXPECTED_SKILLS` 25 → 26 (see decision log). |
| `test/structure-check.test.js` | NEW — 23 black-box tests over `bash …/check.sh --share <repo> <fixture>`: the plan-§6 matrix in full (parity pin, zero-mutation sweeps, marker matrix incl. the R3-precedence pin, safety bar, keep-out both ways, wiki routing, renamed dir, placeholder rule, cannot-run). |

## Verification (2026-08-07)

- **bash↔JS hash parity, direct probe:** `hashFor()` vs the bash pipeline on repo `CLAUDE.md`,
  `AGENTS.md` (elision path), scaffold `CLAUDE.md`, scaffold `tasks/README.md` — all four hashes
  byte-identical. Transitively re-pinned by the fresh-conforming test on every scaffold file.
- **New suite:** 23/23 pass.
- **Full suite:** `npm test` → **643 tests, 643 pass, 0 fail, 0 skipped**, prove-red hard gate
  PASSED (all 14 mutations red their named assertions).
- **Live smoke on this repo** (share auto-resolved to the checkout): exit 1;
  `conforming=39 owner-edited=9`, all other counts 0; `git status --porcelain` byte-identical
  before/after. The 9 = the **seven known-drifted `ai-agents/` files** (`ai-agents/README.md` + six
  conventions — the ADR-039 trigger-2 evidence, now visible through the tool) **plus `CLAUDE.md` and
  `AGENTS.md`**, which are this dogfood repo's own heavily-customized root files — `owner-edited` is
  the correct verdict for them, not a defect.
- **Brief verification 7 (read-only audit):** non-comment code lines of `check.sh` contain **zero**
  write commands (no `mkdir`/`cp`/`mv`/`rm`/`touch`/`mktemp`/`chmod`) and no file redirect other
  than `>/dev/null` and `>&2`. The zero-mutation test sweeps prove the same at runtime. (A naive
  grep is NOT empty — it hits comments, `never touch` detail strings, and awk `i > lb`
  comparisons; the audit above is the honest form of the check.)

## Decision log (ADR-019/ADR-032 audit obligation — unattended calls under the standing approval)

Per-fix review approvals: **none processed** — this spawn was the Build worker; no review findings
reached it, so no fix was applied unattended in the process-review sense. Obvious-winner /
interpretation calls made without asking, each inside the approved plan's intent:

1. **`test/skill-frontmatter.test.js` `EXPECTED_SKILLS` 25 → 26.** Not named in plan §5; required
   by plan §7's "full `npm test` green", and the pin's own header mandates updating it as a
   deliberate part of a legitimate skill addition. Mechanical, in-plan. (Same fact: the three
   architecture.md count sites — plan named two; the §1 "25 dirs" bullet is the identical count and
   was updated with them.)
2. **`kept-out` does not trigger exit 1.** The plan defines exit 1 as "nonconformities/refusals
   found"; a keep-out entry is recorded deliberate intent — neither. A deliberately opted-out
   project reports kept-out rows and exits 0. Pinned by test; stated in `check.sh`'s header and
   SKILL.md.
3. **Fail-closed keep-out emits no per-row lines for `ai-agents/`** (loud stderr, root files still
   checked, exit 1) — mirrors init's R1 behavior (skip + warn) as the plan directs; documented in
   the script header and SKILL.md as the one exception to one-line-per-row. Pinned by test.
4. **Rows under a refused subtree** (symlinked or wrong-typed ancestor) carry the ancestor's
   outcome with an "unreachable — inside refused subtree" detail — the plan is silent on child
   rows; refusing once at the root and never probing below is init's own subtree rule. Pinned by
   test.
5. **Test fixture swap in the CRLF case:** `ai-agents/tasks/README.md` has shipped exactly one
   version ever (single manifest row), so it cannot carry the "older shipped" role; roles swapped
   with `ai-agents/README.md` (generic-era version differs). Non-vacuity asserted in the test.
6. **`missing` wiki-vault files report `missing`** (with ADR-005 in the detail), not `wiki-routed` —
   the plan reserves `wiki-routed` for `schema.md` content nonconformity; existence failures use the
   same outcome as every other class. Pinned by test.

## Decision log — review round 1 (fkit-process-stateful-review worker, 2026-08-07)

Spawned as the sprint-loop's Process-review worker under the declared-approval marker (plan
re-hash-verified on start: `63ce79b18cfb66be4535a7d700efe605ba84b9a4`, 18133 bytes — matched).
Owner rulings relayed by the driver governed every disposition (see review.md's Coder response
preamble). Fixes applied without a per-fix ask, each recorded per the ADR-019/ADR-032 audit
obligation:

1. **R2 fix (owner-ruled, standing approval).** Answers finding R2. Changed
   `test/structure-check.test.js` only: (a) header ⚠️ block rewritten — the fresh-conforming case
   does NOT pin bash↔JS parity (conforming short-circuits on the scaffold copy's bash-computed
   hash); parity is pinned by the manifest-matched fixtures; (b) new test "an OLD marker-BEARING
   root file classifies untouched-stale — the ELISION-path parity pin": oldest marker-bearing
   shipped `claude/scaffold/CLAUDE.md` (found by history walk, non-vacuity asserted: has exactly
   the marker pair, differs from current; its JS-elided hash `035a2a8a…` verified present in the
   manifest) must classify `untouched-stale`. Qualified: verified-CORRECT + owner-ruled this round
   + test-only + in-plan (§6's fixture matrix, §8's named top risk). Red-capability proven: with a
   transient `i > lb` → `i >= lb` elision mutation in `check.sh`, ONLY this test reds (23/24 —
   fresh-conforming stays green, which is R2's claim demonstrated); mutation reverted, `cmp`
   byte-exact against the pre-mutation backup.
2. **R9 fold-in (obvious-winner within the spawn's explicit fold-in license).** Answers finding
   R9. Two lines in the same file R2 edits: `log.md` written and asserted `conforming` in the
   existence-only test. Qualified: ≤2-line trivial companion to R2's file edits, license stated in
   the spawn prompt; `ai-agents/wiki-vault/log.md` confirmed a spec inventory row (spec line 112)
   before adding.
3. **R11 NOT folded (boundary call).** Same size-class as R9 but in `test/skill-frontmatter.test.js`
   — not a file R2's fix touches, so outside the license's "companion to R2's file edits" bound.
   Recorded as an accepted residual with a fix-on-next-edit re-raise instead. When in doubt about
   the shape, don't widen.
4. **Ledger status → closed-out.** All round-1 findings dispositioned under explicit owner rulings;
   nothing blocking remains. The driver re-verifies; a reviewer round 2 can reopen.
5. **R10 status vocabulary.** The Coder-response Status value `routed (new task)` is outside the
   skill's status vocabulary; used because owner ruling 3 explicitly orders "record in the ledger
   as routed-to-new-task" — a spawn instruction naming an owner ruling beats the skill rule on that
   point (CLAUDE.md hard-rule seam), noted in the row itself.

No other fix was applied unattended; no other obvious-winner call was made.

## Not done / out of scope (stated, not skipped silently)

- No prove-red mutation for `check.sh` — plan §6's stated assumption (ADR-026 scope is
  hooks/launcher).
- No repair, no consent prompt, no launch-path change, no wiki write, no task-file move, no commit —
  out of scope by brief; the repair phase is 0246.
- `.claude/` copies not refreshed by hand — gitignored refreshes; next launch or
  `claude/fkit-claude-init.sh .` propagates (plan §5.8).
