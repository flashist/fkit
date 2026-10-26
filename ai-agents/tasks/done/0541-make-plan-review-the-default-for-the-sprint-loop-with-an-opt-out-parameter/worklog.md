# Worklog — 0541: plan review on by default in sprint-loop runs, `--no-plan-review` opt-out

Build worker: `fkit-coder`, spawned by `fkit-sprint-ship-loop` (fkit-lead driving, Sprint 12 run started
2026-10-24T14:06Z), under the ADR-055 declared-approval marker — owner approved the plan via
`AskUserQuestion`, 2026-10-24 (~14:19 UTC), `fkit lead` session, selected option *"Approve"*. Plan
carried verbatim; `git hash-object plan.md` = `53c30d6e9e0a35022329033498a0b75aa87f7764`, matching the
pointer. Step 0 (ADR-059 + ADR-056 additions) was done by fkit-architect before this Build; ADR-059 sits
at the architect's slug `adr-059-plan-review-on-by-default-with-a-no-plan-review-opt-out-sprint-loop-runs-first-provisional.md`.
Neither ADR was edited by Build.

## Work log — 2026-10-24

- **Step 1 — `claude/skills/fkit-sprint-ship-loop/SKILL.md`.**
  - *"**Argument:**"* paragraph: `--no-plan-review` optional, absent = on (ADR-059, amending ADR-056);
    `--plan-review` accepted as a no-op; both flags or any unrecognised `--` token → stop before the
    first spawn, report, ask. "one optional flag" → "one optional opt-out flag". Litmus sentence kept.
  - Gated block (markers kept): heading → *"Plan review — on unless the run was started with
    `--no-plan-review`"*; gating sentence flipped; run-start report → *"Plan review: ON (default)"*;
    switch line → the D5 text, plus "the text is the same whether or not `--plan-review` was also
    passed"; "a later `--plan-review` run" → "a later run with plan review on"; roll-up →
    *"Plan review: ON (default)"*. Everything else in the block unchanged.
  - §Progress reporting bullet → both report lines per owner Q2 / ADR-059 Decision 7 (opening and
    roll-up), and "a report with neither line is a defect, not a quiet off" (ADR-059 Decision 7).
- **Step 2 — `claude/skills/fkit-plan-task/SKILL.md`, gated section.** Gate sentence accepts the D5
  line and the pre-ADR-059 line (D6). "Nothing else turns it on", the brief-is-not-the-switch rule,
  the Decision-record pointer (ADR-056) and the rest of the section unchanged. Workflow untouched.
- **Step 3 — `claude/agents/fkit-lead.md`.** Bullet rewritten per D7: on by default in sprint-loop
  runs (ADR-056 as amended by ADR-059, provisional); `--no-plan-review` only when the owner asks, never
  unasked, never carried; "the next run is on unless he asks for the opt-out again". Session-path
  sentence kept.
- **Step 4 — `ai-agents/tasks/README.md` + `claude/scaffold/ai-agents/tasks/README.md`.** "the opt-in
  plan-review record" → "the plan-review record", padded with 7 spaces so `(ADR-056)` stays at the
  same column. Twins byte-identical (`cmp`). `npm run generate:manifest` → 93 entries; the manifest
  gained one line (the new README hash; old hashes are kept as known-stale history, as the generator
  does).
- **Step 5 — `CHANGELOG.md` `## Unreleased`.** One entry at the top: default on, `--no-plan-review`
  opt-out, `--plan-review` no-op, report says which path, Codex-less → Claude-only flagged, provisional,
  session paths unchanged.
- **Step 6 — sweep.** See below.
- Not run: `claude/fkit-claude-init.sh .` (plan Verification 7). Not touched: ADR-056, ADR-059,
  `sprint-12.md`, any brief, `plan.md`, `fkit-task-ship-loop`, hooks, `skills-for-role.sh`, wiki.

## Decision log

Autonomously-applied fixes: **none** (Build, no review round yet).

Obvious-winner calls (each within the approved plan's intent):

1. **Switch-line intro wording** (sprint loop, gated block, *Plan step* bullet). The old text said the
   line "names the owner's run-start ruling"; with no flag passed there is no run-start ruling, so it
   now says "names the owner's standing default ruling". Qualified: plan D5 says *"It still names an
   owner ruling (ADR-037), now the standing default ruling"* — this is that sentence, applied.
2. **Where the opted-out report line lives.** The gated block is skipped entirely in a
   `--no-plan-review` run, so the *"Plan review: off (--no-plan-review)"* line is stated in
   §Progress reporting (outside the markers), not inside the block. Qualified: plan Step 1 already
   routes the §Progress reporting bullet to owner Q2; ADR-059 Decision 7 places both lines in the
   opening report and roll-up. Keeping it outside the block is the only placement where an opted-out
   run reads it.
3. **ADR-059 named inside plan-task's gate sentence, Decision-record pointer left as ADR-056.** Plan
   Step 2 says the rest of the section is unchanged; the switch-line text itself names ADR-059, so no
   extra pointer was added. Qualified: mechanical, smallest change inside Step 2.
4. **README alignment.** Re-padded the shortened row so its `(ADR-056)` column is unchanged (plan
   Step 4: "keeping the tree's column alignment"). Mechanical.

## Step 6 sweep — hit list

Search: `claude/` (excluding `structure-manifest.tsv`), `ai-agents/tasks/README.md`,
`ai-agents/README.md`, for `--plan-review`, "off by default", "default off", "only when the owner
asks", "never adds it unasked", "opt-in", "plan review" / "plan-review" (case-insensitive).

| Hit | Verdict |
|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` — Argument paragraph, gated block, §Progress reporting | edited (Step 1). Remaining `--plan-review` mentions are the no-op rule; remaining ADR-056 links are its filename (contains "opt-in … off-by-default") — history, correct. |
| `claude/skills/fkit-plan-task/SKILL.md` — gated section (gate sentence, ADR-056 pointer, hop-budget flag, record block, `plan-review:begin/end`) | gate sentence edited (Step 2); the old-form `--plan-review` mention is D6's accepted pre-ADR-059 line; rest correct, unchanged. |
| `claude/agents/fkit-lead.md` — plan-review bullet | edited (Step 3). "only when the owner asks" now applies to `--no-plan-review` — correct. |
| `claude/agents/fkit-coder.md` — switch-line mention; adversarial-reviewer "plan-review Codex pass" | no edit — still correct (pre-checked in plan). |
| `claude/agents/fkit-producer.md`, `claude/agents/fkit-architect.md` — "a plan-review consult" | no edit — role behaviour, independent of the default. |
| `claude/skills/fkit-adversarial-review/SKILL.md` — "a plan-review record" as a coordination doc | no edit — file type only. |
| `claude/skills/fkit-stateful-review/SKILL.md`, `claude/skills/fkit-process-stateful-review/SKILL.md` — `plan-review.md` as a coordination doc | no edit — file name only. |
| `ai-agents/README.md` + `claude/scaffold/ai-agents/README.md` — `plan-review.md` in the tasks row | no edit — file name only. |
| `ai-agents/tasks/README.md` + scaffold twin — tree row | edited (Step 4). |
| `claude/skills/fkit-status/dashboard.sh` — "OPT-IN `tail` MODE", "opt-in tail mode" (4 hits) | no edit — unrelated (dependency-tail mode, `0492`). |
| `test/`, `claude/hooks/` — any plan-review / switch-line reference | none found (grepped) — nothing pins the switch line mechanically (ADR-059 *Negative / costs*). |
| Stale report wording `ON for this run` / old switch-line text anywhere in `claude/`, `test/`, `bin/` | none left, except D6's accepted old form in plan-task's gate. |

## Verification

- `npm run generate:manifest` — ran; wrote `claude/structure-manifest.tsv`, 93 entries.
- `npm test` — ran; **937 tests, 936 pass, 0 fail, 1 skipped** (the opt-in board benchmark,
  `FKIT_BOARD_BENCH=1`; unrelated, pre-existing), ~79 s (inside the 2-min budget). Covers
  `dual-home-parity` and `structure-manifest`.
- Skipped: `test:prove-red` (no launcher, hook or `skills-for-role.sh` touched); `test:release` (no
  `bin/release.mjs` touched). No new test file (ADR-057 §D2.1).
- Hand walk-throughs (plan Verification 1–4), by reading the edited text:
  - no flag → gated block runs; plan-only spawn carries the D5 line; opening + roll-up say
    *"Plan review: ON (default)"*. `--plan-review` alone → same (no-op).
  - `--no-plan-review` → block skipped; Plan row and gate as before; report says
    *"Plan review: off (--no-plan-review)"*. Old-path text kept (`git diff`: only the gating sentence,
    heading and report lines changed inside the markers).
  - both flags / misspelled flag → Argument paragraph stops the run before its first spawn.
  - `fkit-lead.md`: opt-out only when asked, never unasked, never carried.
- Verification 5 (ADR quotes/additions-only): ADR-059 and ADR-056 were the architect's Step 0; Build
  did not edit or re-audit them.
- **Verification 7 — live check: NOT RUN**, as planned. Needs `.claude/` refreshed and `fkit lead`
  relaunched, which cannot happen inside this Sprint 12 run. The owner's next fresh run after refresh
  + relaunch is the live check.
- Brief Verification step 2 ("reports read as a run without `--plan-review` does today"): with owner
  Q2 = *"Say both ways"*, an opted-out run's report differs from the old off run by one line,
  *"Plan review: off (--no-plan-review)"* — as the plan's §4 said it would.

## Verify (independent)

2026-10-24, fkit-coder Verify spawn (sprint loop). Read-only apart from this section.

- `npm test` — ran; 937 tests, 936 pass, 0 fail, 1 skipped (`FKIT_BOARD_BENCH=1` board benchmark, opt-in, unrelated).
- Manifest current — `node bin/generate-structure-manifest.mjs --stdout` to scratchpad, `cmp` vs `claude/structure-manifest.tsv`: identical. Tree untouched.
- README twins — `cmp ai-agents/tasks/README.md claude/scaffold/ai-agents/tasks/README.md`: byte-identical; new scaffold hash `48c10d95…` is the manifest's added row.
- ADR-056 — `git diff --numstat`: 46 added, 0 removed (additions only).
- plan.md — `git hash-object` = `53c30d6e9e0a35022329033498a0b75aa87f7764` (matches).
- Relative links in the edited skill/agent files and ADR-056/059 — all resolve.
- Skipped: `test:prove-red` (no launcher, `skills-for-role.sh`, hook or their tests touched); `test:release` (no `bin/release.mjs`); live check (needs `.claude/` refresh + relaunch; `fkit-claude-init.sh .` not run by instruction).

## Process-review — Round 1 (2026-10-24)

`fkit-coder` Process-review worker, spawned by `fkit-sprint-ship-loop` (fkit-lead driving, Sprint 12 run
started 2026-10-24T14:06Z) under the ADR-055 marker; plan blob `53c30d6e9e0a35022329033498a0b75aa87f7764`
re-checked. Ledger `review.md`, findings R1–R2. No accepted residuals; no ADR "Re-raise only if" covers
either finding (ADR-059's own do-not-re-raise items checked). Not a loop: round 1.

### Decision log — fixes applied without per-fix owner approval

1. **R1** (ADR-059 Decision 4, *"only their gating sentence flips"*). **Changed:** that clause now says
   the blocks stay and their flow is unchanged; the gating sentence flips, and the wording that follows
   from it — heading, report lines, switch line (Decisions 6 and 7) — is updated to match. **Qualified:**
   verified `CORRECT` against the sprint-loop gated block's `git diff`; one clause in one file
   (mechanical/localized); in-plan — plan Step 0 defines ADR-059's content and plan Step 1 lists exactly
   these block edits, so the fix makes the ADR agree with the approved steps. `plan.md` § Summary's same
   phrase **not edited** (approved bytes).
2. **R2** (ADR-059 Decision 3, *"That task is **not yet filed**"*). **Changed:** Decision 3 now names
   `0542` (slug, Sprint 12, depends on `0541`, owner placement *"Sprint 12 (Recommended)"*); the re-raise
   item reads *"session-path design task (`0542`)"*. **Qualified:** verified `CORRECT` against `0542`'s
   brief and `sprint-12.md` row P12; two phrases in one file, factual update; in-plan — ADR-059 records
   the session-path design task the owner's Q1 answer called for. ADR-056 needed no edit (its note's
   *"the design task ADR-059 Decision 3 names"* is now true); ADR-056 stays additions-only vs HEAD.

Obvious-winner calls: **none**.

## Re-verify (post-review) — 2026-10-24
Read-only spawn by fkit-sprint-ship-loop (fkit-lead). Result: **pass**.
- `npm test`: 937 tests, 936 pass, 0 fail, 1 skipped (exit 0).
- ADR-056 `git diff --numstat`: 46 added / 0 removed (additions only).
- `plan.md` `git hash-object` = `53c30d6e9e0a35022329033498a0b75aa87f7764` (unchanged; mtime predates review).
- ADR-059: all 9 relative links resolve; `0542` reference matches `ai-agents/tasks/backlog/0542-design-plan-review-on-by-default-for-the-coder-session-task-ship-loop-and-plain-plan-task/`; stale phrases ("only their gating sentence flips", "not yet filed") gone.
- `review.md` header `Status: closed-out`.
- Post-review scope: only ADR-059, `review.md`, `worklog.md` modified after the build (mtimes; ADR-059 is untracked so `git diff` cannot show it).
- Skipped: `claude/fkit-claude-init.sh .` (forbidden by spawn).
