# Plan — 0529: cut the test suite down to shipped-script behaviour tests

Source of truth: ADR-057 (accepted 2026-10-19) and its dated ⚠️ / ⛔ notes. Where the brief and the ADR disagree, the ADR wins.
- ⚠️ **One deviation, put to the owner (Q1):** ADR-057 §D3 and brief step 6 say *"`0529` renumbers if it rewrites the file"*. This plan rewrites `test/prove-red.sh` but **keeps the numbers M1, M2, M30, M31**, because ADR-057, `CONTRIBUTING.md` and the owner's own Q1 context cite them. If the owner picks renumbering, step 4 renumbers 1–4 and the files citing the numbers change with it.
- Wording point, no build effect: the brief files `top-level-doc-links` under category 5; it reads the repo's top-level docs, not `ai-agents/`. It is outside categories 1–2 and not a named exception, so it is deleted either way.

## Summary
- Delete 19 test files, 1 helper, 2 fixtures. Keep 22 files in `npm test` (19 shipped-script tests + 3 named exceptions). Move `release-summary` to `test/release/`, run by a new `npm run test:release`.
- `npm test` becomes `node --test test/*.test.js` — no prove-red, no release test. **Measured during planning: the 22 kept files ran in 58.5 s** (845 tests, all pass; 2026-10-20 07:47Z; Mac load average ~11 on 14 cores — busy, not idle; one run, indicative only).
- Prove-red: 55 cases → M1, M2, M30, M31, each running only its own test file, plus two narrowed baselines. Out of `npm test`; still `npm run test:prove-red`. Estimated ~2–3 min a run (not yet measured).
- ⚠️ **Gap until `0530` lands:** CI and `npm run release` both run only `npm test`. From this build until `0530` adds the nightly lane and settles the release gate, **prove-red runs in no automated gate, and `npm run release` runs neither prove-red nor the release tool's own test** — the "by hand only" state ADR-057 §D3 rejected as an end state. `RELEASING.md` tells the releaser to run both by hand before a release in that window (step 7). Owner Q3.
- The three banner timing tests stay as they are (they sleep ~25 s a run); owner Q5.
- Shipped prompts that tell agents to run deleted tests are fixed: the four movers (no automated link check any more; the close report says so), `fkit-record-decision`, `fkit-wiki-lint`, the two stateful-review skills, `fkit-review`, `structure-spec.md`; plus code comments the cut makes wrong.
- No check in this plan runs the old full suite. All checks run after the cut lands; total check time ≈ 8 min.
- ADR drift notes: an `fkit-architect` worker spawned after the build, before review — routing already set by brief step 9.

## Per-file table (ADR-057 §D1)
Categories: 1 launcher / init / hooks; 2 shipped skill executables; 3 repo-only `bin/` tools; 4 wording/shape of prompts and documents under `claude/`; 5 this repo's own content.

| File | Cat | Fate | Reason |
|---|---|---|---|
| `adr-number-uniqueness.test.js` | 5 | delete | ADR numbers in `ai-agents/`; `/fkit-record-decision` and `/fkit-wiki-lint` keep their own check (ADR-057 §Consequences) |
| `adversarial-prompt-path.test.js` | 4 | delete | wording of the three review skills |
| `asking-the-owner-rule.test.js` | 4 | delete | wording of role prompts / skills |
| `askuserquestion-marker-hook.test.js` | 1 | keep | hook behaviour |
| `board-archived-id.test.js` | 3 | delete | `bin/fkit-board.mjs` |
| `board-narrow.test.js` | 3 | delete | `bin/board-narrow.mjs` |
| `board-reader.test.js` | 3 | delete | `bin/fkit-board.mjs` |
| `board-root.test.js` | 3 | delete | `bin/fkit-board.mjs` |
| `carry-check-hook.test.js` | 1 | keep | hook behaviour |
| `closed-rank-immutability.test.js` | 5 | delete | sprint-board content |
| `code-comment-rule.test.js` | 4 | delete | prompt wording |
| `converge-contract.test.js` | 1 | keep | init convergence (key list item 4) |
| `coordination-citation-policy.test.js` | 5 | delete | ADR-057 §D6 |
| `dashboard-contract.test.js` | 2 | keep | `dashboard.sh` (see assumption A1) |
| `dual-home-parity.test.js` | 5 | keep — named exception | ADR-057 §D7, owner Q4b; header reworded |
| `init-claude-refresh-guard.test.js` | 1 | keep | init (key list item 4) |
| `init-intake-guard.test.js` | 1 | keep | init |
| `launcher-agents-guard.test.js` | 1 | keep | launcher |
| `launcher-contract.test.js` | 1 | keep | launcher argv (key list item 1); M2 / M30 / M31 |
| `mover-exemption-step.test.js` | 4 | delete | movers' prose; that step is removed in step 6 |
| `orphan-cleanup.test.js` | 1 | keep | key list item 4 |
| `plan-review-switch.test.js` | 4 | delete | prompt wording |
| `reference-integrity.test.js` | 5 | delete | ADR-057 §D6 |
| `release-summary.test.js` | 3 | **move** → `test/release/release-summary.test.js`, `npm run test:release` | named exception, own script (§D4 / §D7, owner Q4a (c)) |
| `rules-block-budget.test.js` | 1 | keep | init's `RULES_MAX` guard |
| `shiploop-marker-hook.test.js` | 1 | keep | hook behaviour |
| `skill-frontmatter.test.js` | 4 | delete | prompt shape |
| `skill-ownership-hook.test.js` | 1 | keep | key list items 2–3; M1 |
| `spawned-write-marker.test.js` | 4 | delete | prompt wording |
| `sprint-loop-later-sprint-record.test.js` | 4 | delete | prompt wording |
| `structure-check.test.js` | 2 | keep | heal `check.sh` |
| `structure-manifest.test.js` | 4 | keep — named exception | ADR-057 §D7 ⛔ R1 note; header reworded |
| `structure-notice.test.js` | 1 | keep | launcher |
| `structure-repair.test.js` | 2 | keep | heal `repair.sh` (key list item 4) |
| `structure-spec.test.js` | 4 | delete | `structure-spec.md` vs scaffold |
| `task-id-uniqueness.test.js` | 5 | keep — named exception | ADR-057 §D7 / §D5, owner Q5 (b); header reworded |
| `throughput-counter.test.js` | 2 | keep | `throughput.mjs` |
| `top-level-doc-links.test.js` | 5 (repo docs) | delete | not a shipped script, not a named exception |
| `turn-completion-hook.test.js` | 1 | keep | hook behaviour |
| `update-banner.test.js` | 1 | keep | launcher; ADR-057 §D8 / 0526 (see A5) |
| `update-reinstall.test.js` | 1 | keep | launcher |
| `wiki-flag-convention.test.js` | 4 | delete | prompt wording |
| `prove-red.sh` | — | keep, cut to 4 cases | ADR-057 §D3 |
| `harness.mjs` | helper | keep | used by kept files; its now-unused `liveTaskFolders` export removed |
| `link-condition.mjs` | helper | delete | only users: `reference-integrity`, `coordination-citation-policy`, `top-level-doc-links` |
| `dual-home-parity-exceptions.mjs` | helper | keep | used by `dual-home-parity` |
| `fixtures/closed-rank-0174-{before,after}.md` | fixture | delete | only user: `closed-rank-immutability` |

Counts: 19 deleted, 22 kept in `npm test`, 1 moved. Named exceptions: four, matching ADR-057 §D7 plus its ⛔ R1 note — three in `npm test`, `release-summary` in its own script. **Approving this plan approves this table** (owner Q2).

## Steps

### 0. Pre-flight (no tests run)
Record `git status --short` and `uptime` in `worklog.md`. If another task has uncommitted edits under `test/`, `claude/` or `bin/`, stop and return NEEDS-DECISION rather than build over them.

### 1. Delete
- Delete the 19 files, `test/link-condition.mjs`, both `test/fixtures/closed-rank-0174-*.md` and the then-empty `test/fixtures/`. Plain delete, nothing staged or committed.
- Before deleting each helper or fixture, `grep -rn "<name>" test/` confirms only deleted files use it.
- `test/harness.mjs`: remove the `liveTaskFolders` export (only users: `board-reader`, `board-root`, both deleted) and any import only it used. Nothing else in the harness changes.

### 2. Move the release test (ADR-057 §D4 / §D7, owner Q4a (c))
- `test/release-summary.test.js` → `test/release/release-summary.test.js`; its one import `./harness.mjs` → `../harness.mjs` (it finds `bin/release.mjs` through the harness's `REPO`, which does not move).
- Why a subfolder: the shell glob `test/*.test.js` does not descend into it, so the default suite stays a plain glob with no exclusion list. Rejected: an exclusion inside the `test` script (`$(ls … | grep -v …)`) — keeps the path but hides the rule in a shell trick.
- Cost of the move: ADR-057 §D4 / §D7 and `0530`'s brief name the old path. The ADR gets a ⚠️ note (step 10); `0530`'s brief is the producer's (hand-off).
- Whether `npm run release` runs it is `0530`'s — untouched.

### 3. `package.json` scripts
```
"test": "node --test test/*.test.js",
"test:unit": "node --test test/*.test.js",
"test:prove-red": "bash test/prove-red.sh",
"test:docs": "node --test test/dual-home-parity.test.js test/task-id-uniqueness.test.js",
"test:release": "node --test test/release/*.test.js",
```
- `test:unit` kept as an alias of `test`, and `test:docs` kept, redefined to the two kept tests that read the live `ai-agents/` tree (under 1 s): 7 open briefs (`0386`, `0387`, `0397`, `0467`, `0487`, `0491`, `0503`; `0503`'s plan and worklog too) name one of them in their verification steps, so they keep working. Listed in the hand-off anyway.
- `test` stays on line 5 (ADR-014 and ADR-026 cite `package.json:5`).

### 4. Rewrite `test/prove-red.sh` (ADR-057 §D3 and its R2 notes, owner Q1 (c))
- Keep: the step / kept-output machinery (`keep_output`, `step`, `on_exit`, the trap), `make_claude_copy`, `run_hook_suite`, and the blocks for **M1, M2, M30, M31** with their no-op, wrong-target, named-assertion and narrowness guards unchanged.
- `run_suite` → renamed `run_launcher_suite`, narrowed to `FKIT_LAUNCHER="$1" node --test "$repo/test/launcher-contract.test.js"` (today it runs `test/*.test.js`, every file).
- Baselines kept, narrowed: **0b** (unmutated full copy → `launcher-contract` green; proves M2 / M30 / M31 reds come from the mutation, not from setup) and **0c** (unmutated copy's hook → `skill-ownership-hook` green; the same for M1). **0a dropped**: it re-runs the default suite on the real launcher — the exact duplicate of `npm test` — and 0b runs the same file on a copy of the same tree, so a red real tree still fails 0b. (ADR-057's R2 note leaves which baselines stay to `0529`.)
- Delete: baselines 0a, 0d–0p; mutations 3–29 and 32–55; every helper only they use (`run_turn_hook_suite`, `run_marker_hook_suite`, `run_shiploop_marker_suite`, `run_carry_check_suite`, `run_frontmatter_suite`, `run_wiki_flag_suite`, `run_mover_step_suite`, `run_parity_suite`, `run_dashboard_suite`, `run_throughput_suite`, `run_banner_suite`, `run_reinstall_suite`, `run_agents_guard_suite`, `run_release_suite`, `make_release_copy`, `make_scaffold_copy`, `make_repo_copy`, `swap_literal_line`, `check_literal_swap`, `check_healthy_green`).
- Numbering: **kept** (M1, M2, M30, M31; baselines 0b, 0c), with a one-line header note on why — the deviation named at the top, owner Q1. If the owner picks (b), renumber to 1–4 (baselines 0a, 0b) and update `CONTRIBUTING.md`'s prove-red bullet; ADR-057's numbers then get the step-10 note instead.
- Header rewritten for the four cases (index, the two setup subtleties that still hold, how to read a red); stale parts deleted (the 55-case index, the `bin/` mutation notes, mutation 14's no-seam note, the live-`ai-agents/` warning for `run_suite`).
- What each step runs (shown in `worklog.md`):
  - 0b, 2, 30, 31: `FKIT_LAUNCHER=<copy>/claude/fkit-claude.sh node --test test/launcher-contract.test.js`
  - 0c, 1: `FKIT_SKILL_OWNERSHIP_HOOK=<copy>/claude/skill-ownership-hook.sh node --test test/skill-ownership-hook.test.js`
- The nightly CI schedule is `0530`'s — not touched.

### 5. Test-file headers and comments (ADR-057 §D7; code-comment rule)
- Reword the SCOPE paragraph of the three kept exceptions — `dual-home-parity`, `task-id-uniqueness`, `structure-manifest` — to cite ADR-057 §D7 (`structure-manifest`: §D7's ⛔ R1 note) and the owner answer (Q4b / Q5 (b) / R1); drop the "fourth category" wording and the line-number cites into each other's headers.
- In every kept test file and in `test/release/release-summary.test.js`, fix or delete each comment that names a deleted prove-red case, baseline or helper. **The scope is the grep** `grep -n -i "prove-red\|mutation\|run_suite\|make_repo_copy"`, not this list; known today: `launcher-agents-guard` 49–55, `structure-notice` 15, `update-banner` 16–17 and 44 / 45 / 47 / 48, `update-reinstall` 41 / 46, `dashboard-contract` 14 / 32 and its repo-copy notes, `dual-home-parity` 13, `carry-check-hook`, `throughput-counter`, `structure-manifest` (says `run_suite` runs the whole suite), `release-summary` 18–22 / 25 / 26 / 42 / 43. Comments about M1 / M2 / M30 / M31 and their seams (`FKIT_LAUNCHER`, `FKIT_SKILL_OWNERSHIP_HOOK`) stay.
- **Test seams no case uses any more** (`FKIT_BANNER_ROOT`, `FKIT_REINSTALL_ROOT`, `FKIT_PARITY_SCAFFOLD_ROOT`, `FKIT_RELEASE_MJS`, `FKIT_CARRY_CHECK_HOOK`, `FKIT_TURN_COMPLETION_HOOK`, the marker-hook seams, the dashboard / throughput copied-tree skips): **code left as is**; comments reworded to say what the seam does, without naming deleted cases. Removing them changes test code for no time gain; it fits the comment-cleanup tasks `0513`–`0515` if the owner rescopes them (Q4).
- No assertion in a kept file changes.

### 6. Shipped prompts and files (`claude/`)
- **The four movers** (ADR-057 §D6 (a)) — `fkit-task-done`, `fkit-task-cancelled`, `fkit-sprint-done`, `fkit-sprint-cancelled`:
  - Replace the whole *"Then check the exemption keys this move may have invalidated"* block (the run command, the two binding rules, the L2 / L4 / L8 bullets — every `test/reference-integrity.test.js` / `NAMED_EXEMPT` reference) with one short paragraph: the resolve-every-link hand check just above it (*"Then prove it."*) is the only link check; no automated link check runs on a close; say so in the report.
  - Add one report bullet, the same in all four: `**Link check:** by hand only — no automated link check ran.`
  - Sprint movers only: the *"What the inversion does NOT buy you: a guard over the widened half"* paragraph → no guard catches a missed reference anywhere, inside `ai-agents/` or out; your own sweep is the only check. Their evidence bullet keeps *"Repointing them would forge the transcript"* and drops the half about keys exempted in the test.
  - No other mover text changes (`dashboard-contract`'s prose pins on the movers sit in their ambiguity step, outside these blocks — `npm test` confirms).
- `fkit-record-decision` (3 sites) and `fkit-wiki-lint` (3 sites): drop `test/adr-number-uniqueness.test.js`; "all three must agree" → the two that remain (the record-decision numbering step and the wiki-lint cross-check). Wiki-lint's *"also asserts this invariant, so `npm test` catches it too …"* parenthetical → this lint step and the allocation step are the only checks; the ⛔ "do not skip it" line stays.
- `fkit-stateful-review` and `fkit-process-stateful-review` (the *Location* coordination-document note): drop *"and `test/coordination-citation-policy.test.js` reds on it in any open task folder"* and *"Backticks do not exempt it — that guard does not mask code spans"*; the rule (heading plus a quoted fragment, never `path:NNN`) and its reason stay. ⚠️ `fkit-process-stateful-review` is the file ADR-019 calls byte-unchanged; this edit is covered by the owner's ADR-057 sign-off (its §D9 row assigns it to `0528` / `0529`) and touches only that note, not the per-round approval gate. `0528`'s Q3 ruling covered `0528` by name only, so `worklog.md`'s decision log records this cover with the §D9 citation.
- `fkit-review` (its dated Codex-sandbox note): `test/prove-red.sh:82` → `test/prove-red.sh` (already stale: the `mktemp -d` is at line 124 today; the rewrite moves it again). The sentence stays true — prove-red survives.
- `fkit-task-brief` step 6: no change (names neither the test nor its licence).
- `claude/structure-spec.md` *Machine-read contract* note: the tables are parsed by heal's `check.sh` and `repair.sh` (both match the two heading lines exactly); keep the load-bearing list, now "not changeable without changing both scripts"; say no test checks the tables against `claude/scaffold/` any more, so a scaffold change updates them by hand; the ADR-005 wiki-vault row rule stays as a written rule. (`claude/structure-manifest.tsv`'s header names the kept test — no change.)
- Comments: `claude/carry-check-hook.sh` (*"so prove-red's copies run their own .mjs"* → a copied tree runs its own .mjs); `claude/carry-check-hook.mjs` (two *"A separate function so prove-red can neuter it"* — deleted, no reason left). `dashboard.sh`'s prove-red-thesis comment stays (still true); `throughput.mjs`'s prove-red data row stays (history data, ADR-057 §D9).
- No file under `claude/scaffold/` changes, so no manifest regenerate.

### 7. Repo docs and repo-only code comments
- `CONTRIBUTING.md`:
  - *Tests* block: `npm test` (default suite), `npm run test:release` (the release tool's test, before a release), `npm run test:prove-red` (four mutants), `npm run test:docs` (the two live-tree tests, fast path); `test:unit` noted as an alias of `npm test`; times from this build's runs, marked one run / machine load, re-measured by `0530`.
  - *Test rules*: the ⚠️ paragraph keeps only `0530`'s part (CI budget, nightly lane) and says that until then prove-red and the release test run only by hand. Named-exceptions bullet → new path `test/release/release-summary.test.js`. Prove-red bullet: *"(today's numbering)"* → *"(numbers kept from before the cut)"* (or the new numbers, per Q1).
  - *What to run* table rewritten for the smaller suite: (1) `LICENSE`, `ai-agents/wiki-vault/` (except `schema.md`), `README.md`, `CONTRIBUTING.md`, `RELEASING.md`, `CHANGELOG.md`, `docs/`, `claude/README.md` → nothing; report "no automated check covers these files"; check links you touched by eye; (2) `bin/release.mjs` → `npm test` + `npm run test:release`; (3) the launcher, `claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh`, `test/launcher-contract.test.js`, `test/skill-ownership-hook.test.js`, `test/prove-red.sh` → `npm test` + `npm run test:prove-red`; (4) anything else (`ai-agents/` — fast path `npm run test:docs` —, other `claude/` files, `claude/scaffold/`, other `bin/` tools, `test/`, `package.json`, `.github/`), or unsure → `npm test`; before a release also `npm run test:release` (0528 hand-off). Bullets: keep "heaviest row" and "report what ran"; the prove-red grep bullet → its short list today; the `test:docs` bullet → only the two named exceptions read the live tree.
  - *Layout*: the `test/` line → default suite; `test/release/` the release test; `test/prove-red.sh` the mutation lane.
- `RELEASING.md` §3 (~lines 136–145): `npm test` is `node --test test/*.test.js` (`package.json:5`); drop the prove-red short-circuit and "over ten minutes" claims; time → `CONTRIBUTING.md`. **Add: until `0530` settles the release gate, also run `npm run test:release` and `npm run test:prove-red` by hand before `npm run release` — the release gate runs only `npm test`.** The gate code stays `0530`'s.
- `docs/board.md`: drop *"`test/board-reader.test.js` pins all of this, including …"* (the claims above it stay).
- `.github/workflows/test.yml`: comment only — the basis comment says it was measured while `npm test` still ran prove-red and that `0530` re-sets it; *"stops a hung prove-red.sh"* → a hung run. `timeout-minutes: 33` unchanged (`0530`).
- `bin/fkit-board.mjs` header (*"test/board-reader.test.js greps this WHOLE file …"*) → keep the rule, drop the test claim. `bin/generate-structure-manifest.mjs` `readBlobs` doc comment → drop *"and prove-red re-runs the whole suite per mutation"*. `bin/release.mjs`: only the summary-block comment *"prove-red mutation 20 replaces the whole line"* → reason reworded without the case. **The gate, its help text and its `(10+ min; includes prove-red.sh)` progress line are `0530`'s** (brief step 10; `0530` step 3 updates them) — that line is false from this build until `0530` lands; flagged in the hand-off.
- `ai-agents/knowledge-base/architecture.md` (coder-owned fact fixes, as in `0397` / `0400`): the test paragraph (`29 suites`; `npm test` = `… && bash test/prove-red.sh`) → post-cut facts, pointing at ADR-057; ~line 416 *"prove-red mutations 16-17"*, ~445 *"guarded by … `test/structure-spec.test.js`"*, ~476 *"their prove-red mutations (mutation 15 …)"* reworded; the stale `package.json:8` cite → the new line of `generate:manifest`.
- `ai-agents/knowledge-base/conventions/dual-home-parity.md` §*Where this is enforced*: *"Its four mutations (10–13) are proved red in `test/prove-red.sh`"* → no longer (cut by ADR-057). Not dual-homed (no scaffold copy), so no parity edit.
- Not edited (listed in `worklog.md` with a reason): open backlog briefs naming deleted tests (producer's — Q4 and the hand-off list), ADRs (step 10), dated reports, sprint boards (history), `ai-agents/wiki-vault/` (fkit-wiki's — flag a sync).

### 8. Checks — in this order; none runs the old suite
| # | Check | Expected time |
|---|---|---|
| C1 | `sh -n test/prove-red.sh`; `node --check` on each edited `.mjs` / `.js` | < 5 s |
| C2 | `npm test` × 3, each with `date -u`, `uptime`, `/usr/bin/time -p`; test count stated | ~1 min each (58.5 s in planning, busy Mac) → ~3–4 min |
| C3 | `npm run test:release` once, timed | ~40 s (38.3 s in ADR-057's one run) |
| C4 | `npm run test:prove-red` once, timed; output shows 0b / 0c green and M1 / M2 / M30 / M31 each red at its named assertion | est. ~2–3 min |
| C5 | Greps: each deleted filename (and `link-condition`, `test:unit`, `test:docs`) over the repo minus `done/`, `cancelled/`, `wiki-vault/`, `.git` — output pasted, every remaining hit classed (history / producer's brief / ADR → step 10); `grep -il fourth test/*.test.js test/release/*.test.js` — output pasted, each hit read, none citing the fourth category as a licence (brief verification 5; expected unrelated hit: `task-id-uniqueness.test.js`'s *"a fourth attempt at correctness"*, left as is); `grep -n "release-summary\|prove-red" package.json` | seconds |
| C6 | `npm run test:docs` once | < 1 s |
| C7 | `claude/fkit-claude-init.sh .` | seconds |

Total ≈ 8 min.
- **Idle-Mac caveat:** verification step 2 asks for three runs on an idle Mac. I cannot make the machine idle; each run records its load average. Runs ≤ 2 min under load are reported as "≤ 2 min under load X". **If any run is over 2 min I report it and return NEEDS-DECISION** — I do not raise the budget, cut further, or start removing the banner tests' sleep unasked (that needs its own owner-approved brief, per `0526`; see Q5).
- C2 red: fix only what this change broke (a deleted helper, the moved import); anything else → NEEDS-DECISION.
- Skipped, with reason: the old full `npm test`; a CI run (needs a push — owner's call); `npm run generate:manifest` (no scaffold change).

### 9. `worklog.md`
The per-file table as approved; the four prove-red commands; the three `npm test` times, count and load; the release and prove-red lane times; the C5 grep output; the not-edited list; a decision log (the `fkit-process-stateful-review` cover with its §D9 citation; each in-plan obvious-winner call, or `none`); the hand-off.

### 10. ADR drift notes (ADR-057 §D11; brief step 9) — after the build, before review
Routing is settled by brief step 9 (the producer's call under §D11): an `fkit-architect` writes the notes in the ADR correction form, after the build and before review — in a `/fkit-sprint-ship-loop` run the driver spawns it as a worker; in a plain `fkit coder` session I ask the owner to run it. I write no ADR. I give the list: I re-run §D11's sweep for each deleted file — strict (`test/<name>`) and loose (`<name>` without `test/`) — over `ai-agents/knowledge-base/decisions/`, plus each ADR citing a deleted prove-red case (ADR-026, -027, -028, -042, -046 per §D11): ADR → deleted test or case it names → line. Strict sweep today: ADR-035, -036, -043, -046, -047, -048, -050, -051, -052 (+ the five prove-red ADRs). Plus: ADR-057 itself (`release-summary` now at `test/release/release-summary.test.js`, run by `npm run test:release`; and, if the owner keeps the numbers under Q1, that §D3's "renumbers if it rewrites" did not happen); ADR-014:92 (*"the three tests ADR-057 §D7 names"* — four since the R1 note). `worklog.md` lists which ADRs got a note and which test each covers.

### Hand-off (in `worklog.md`)
- `0530`: the gap — CI and `npm run release` run only `npm test`, so until `0530` lands no automated gate runs prove-red or the release test; `bin/release.mjs`'s `(10+ min; includes prove-red.sh)` line and help text; the `test.yml` timeout and basis; CONTRIBUTING times; the last ⚠️ paragraph and RELEASING's by-hand line, which `0530` drops when it lands; `0530`'s brief names the old release-test path.
- Producer: the knock-on table (Q4); **the full C5 list of open briefs naming a deleted test, `test:unit` or `test:docs` (~60 today, the 16-row table among them) for a sweep**; `0530`'s brief path; a wiki sync for the deleted tests.
- Optional, not this task: ADR-057 §D3's "not in `0530`'s brief today" drift (0528 hand-off).

## Assumptions
- A1 — Per file, not per test: a kept file keeps all its tests, including the few in `dashboard-contract.test.js` that pin `SKILL.md` prose or read live boards. ADR-057 §D1 sets the table per file; trimming inside a 4,548-line file is a separate change.
- A2 — Numbering kept (Q1).
- A3 — Dead test seams kept (step 5).
- A4 — `test:unit` kept as an alias; `test:docs` redefined.
- A5 — **Banner timing tests kept unchanged** (brief step 7, ADR-057 §D8, owner Q5). The three `0284` tests in `test/update-banner.test.js` (`0284/git-deadline`, `0284/term-ignored`, `0284/no-stray`) wait for real, ~25 s a run, because `FKIT_NET_TIMEOUT` is hard-coded in the launcher. The brief's earlier text said nothing kept may sleep for real; ADR-057 §D8's no-sleep rule binds new tests only. Removing the wait needs a test-only or a launcher change — each its own owner-approved brief (per `0526`). This task changes none of the three.

## Risks / edge cases
- **The 0529→0530 window:** prove-red and the release test run in no automated gate (see Summary). Mitigation: RELEASING.md's by-hand line; `0530` is next in the chain (Q3).
- **The banner tests' real sleep** is most of the suite's wall time (the slowest kept tests run ~14 s, ~6 s, ~6 s, overlapping other files). The planning run was 58.5 s on a busy Mac — one run. If a C2 run goes over 2 min, NEEDS-DECISION (step 8), not a quiet fix.
- A deleted test was the only check on a failure class (`skill-frontmatter`'s silent YAML-description break, link rot, duplicate ADR numbers). Accepted by ADR-057 §Consequences; not re-argued here.
- A kept test silently used a deleted helper or fixture → C2 goes red at import; caught.
- Narrowing `run_launcher_suite` when a named assertion lived in another file → the name check fails. Checked: assertions `2.`, `12.`, `12b`, `12c`, `12d` are all in `launcher-contract.test.js`; M1's `reviewer × fkit-review` is in `skill-ownership-hook.test.js`.
- The `test/release/` glob: `sh` does not recurse `test/*.test.js` — C2's count drops by the release tests; C3 shows they still run.
- The four mover edits drifting apart: they get the same paragraph and report line, word for word (modulo the board word); no test checks that any more — the reviewer reads them side by side.
- Machine load makes C2's times noisy (idle-Mac caveat).

## Open questions for the owner (the driver relays)
- **Q1 — Prove-red numbering.** ADR-057 §D3 and the brief say this task renumbers the four kept cases if it rewrites the file. It does rewrite it, but the numbers M1, M2, M30, M31 are already written in ADR-057, `CONTRIBUTING.md` and the question you answered. (a) **Keep the numbers; ADR-057 gets a dated note saying so (Rec)** — fewest edits. (b) Renumber them 1–4 — more files to edit, and older records stop matching. Knock-on: none either way (checked).
- **Q2 — Per-file table.** (a) **Approve as listed (Rec)**: 19 deleted, 22 kept, 1 moved. (b) Keep some deleted file(s) — name them; each becomes a new named exception and needs an ADR-057 note. Knock-on: none (checked).
- **Q3 — The gap until `0530` lands.** CI and `npm run release` both run only `npm test`. So from this build until `0530`, nothing automatic runs prove-red's four cases or the release tool's own test. (a) **Accept the gap; RELEASING.md tells whoever releases to run both by hand first; `0530` is next in the chain (Rec).** (b) Add a temporary CI step running `npm run test:prove-red` until `0530` adds the nightly lane — a CI edit inside `0529` on ground the brief gives to `0530`. Knock-on: none either way (`0530` already waits on `0529`, both in Sprint 13).
- **Q4 — Old test briefs (the brief's knock-on table, 16 rows).** (a) **Approve the producer's proposals; the producer acts after `0529` closes (Rec):** cancel `0503` (Sprint 12) and `0522`, `0037`, `0214`, `0152`, `0219` (Backlog) — nothing waits on any of them (checked); rescope `0513`–`0515` (Backlog) to what survives, after `0529` (Sprint 13); `0512`, `0156`, `0406` (rescope or cancel) come back to you then. ⚠️ `0513`–`0515` each have `Depends on: 0512` — if `0512` is later cancelled, the producer re-points them, or they wait on a cancelled task. (b) Decide row by row later, after `0529` closes — knock-on: none now (checked); `0503` stays Blocked in Sprint 12. Either way, the 16 rows are not the whole knock-on: about 60 open briefs name a deleted test or script; the producer gets the full list for a sweep.
- **Q5 — The three slow update-check tests.** They wait for real, ~25 s a run, because the launcher's 5-second network timeout is fixed in its code. The ADR's "no real sleeping" rule covers only new tests, and the whole kept suite measured ~1 min with them. (a) **Keep them as they are; propose a speed-up task only if the measured suite goes over 2 minutes (Rec — the producer's recommendation in the brief).** (b) Keep them, and the producer files a speed-up brief now anyway (test-only, or a launcher change; each needs your OK). Knock-on: (a) none (checked); (b) one new Backlog brief — nothing waits on it.
