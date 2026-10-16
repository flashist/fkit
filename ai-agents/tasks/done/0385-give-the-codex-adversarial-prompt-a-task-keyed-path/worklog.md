# Worklog — 0385: give the Codex adversarial prompt a per-run path

Build worker, spawned by `fkit-sprint-ship-loop` (driver: fkit-lead), 2026-10-15. Approved plan:
`plan.md` in this folder (blob `18baf57971fb2e3df152f329b3ee4795889f2b64`, verified with
`git hash-object` before the first edit), with PQ1, PQ2, PQ3 adopted and PQ4 = no change.

## Change surface

- `claude/skills/fkit-review/SKILL.md` — Step 1B item 2: shape B path, label rule (PQ2 sanitising),
  run-id command, "use the printed path verbatim", hazard line, pointer to the stateful shape. Item 3:
  run line quotes the per-run path.
- `claude/skills/fkit-stateful-review/SKILL.md` — Step 1: quoted run line with shape A
  (`<key>-r<N>-<run-id>`, PQ1); a paragraph saying the path differs in both places, `<key>` / `<N>` /
  `<run-id>` defined, the same run-id command, hazard line.
- `claude/skills/fkit-adversarial-review/SKILL.md` — Primary mode items 2–3: shape B, self-contained,
  `<NNNN>-plan` label, same command, quoted heredoc and run line, hazard line. Fallback banner and the
  `**Or a plan:**` / `**When the input is a plan**` / ``never `path:line` `` phrases untouched.
- `claude/agents/fkit-adversarial-reviewer.md` — §Your procedure: "a per-run prompt file under
  `.fkit/tmp/` (a task label plus a run id — the skill gives the rule)".
- `claude/README.md` — §The Codex adversarial pass: quoted run line with the stateful shape, one
  sentence on per-run names and why.
- `CHANGELOG.md` — one `## Unreleased` line.
- `test/adversarial-prompt-path.test.js` — new guard test (5 checks + control arms).
- `.claude/` copies refreshed by `claude/fkit-claude-init.sh .` (gitignored; not edited by hand).

## Checks

1. `grep -rn "adversarial-prompt" claude/` — no bare literal. Every hit is a `<run-id>` path, or the
   run-id command itself (one line in each of the three skills).
2. Concurrency walk (by reading; run ids taken from a real run of the command in bash, zsh and sh in
   the same second, which printed process numbers 83424, 83433, 83438):
   - Two tasks, stateful: `.fkit/tmp/0385-r1-20261015T182130Z-83424-adversarial-prompt.md` vs
     `.fkit/tmp/0400-r1-20261015T182130Z-83433-adversarial-prompt.md` — differ (key, run id).
   - Same task, different rounds: `0385-r1-20261015T182130Z-83424-…` vs `0385-r2-20261015T182130Z-83433-…`
     — differ (round, run id).
   - Same task, stateful + ephemeral: `0385-r1-20261015T182130Z-83424-…` vs
     `0385-20261015T182130Z-83433-…` — differ (after `0385-`, `r` vs a digit).
   - Two no-task ephemeral runs on `main` in the same second: `main-20261015T182130Z-83424-…` vs
     `main-20261015T182130Z-83433-…` — differ (process number).
   - Added by PQ1: two stateful reviews, same task, same round: `0385-r2-20261015T182130Z-83424-…` vs
     `0385-r2-20261015T182130Z-83438-…` — differ (process number).
   - PQ2 sanitising, by hand: branch `feat$(id)/x y` → label `feat--id--x-y`.
3. `npm test` (run after this worklog was written): node suite **1139 tests, 1138 pass, 1 fail** —
   baseline 1133 + the 6 new tests, all 6 new pass; the one failure is the baseline failure below,
   unchanged. `npm test` chains `&& prove-red`, so prove-red was run on its own: all 43 mutations go
   red as they should; its steps 0a/0b (unmutated suite must be green) fail on that same one test, and
   the script exits 1 because of it.
4. `skill-frontmatter` and `plan-review-switch` run on their own: 42/42 pass. `dual-home-parity` runs
   inside the `npm test` run.
5. `git status` — changes from this task only under `claude/`, `test/`, `CHANGELOG.md` and this
   worklog; the other modified files are 0516's, uncommitted before this task started.
- Dogfooded copies: `claude/fkit-claude-init.sh .` exit 0; `git status --short` identical before and
  after; `cmp` of the four changed `claude/` agent/skill files against their `.claude/` copies: same.

⚠️ **Baseline, before the first edit:** node suite 1133 tests, 1132 pass, **1 fail** —
`coordination-citation-policy.test.js` "L2 live corpus: RESIDUAL is 0", because this folder's
`plan.md` (line 62) cites the wiki log by a line number. `plan.md` is the approved plan and is not
edited here; the failure is not caused by this build.

## Decision log (obvious-winner calls, all inside the approved plan's intent)

- **D1 — one command for both shapes.** PQ1 asks for the stateful shape `<key>-r<N>-<run-id>` *and*
  a run-id command byte-identical across all three skills. Both hold only if the stateful skill
  reuses the command with `<key>-r<N>` written where it says `<key>` — so it says that, with the
  example `0337-r2`. Why it qualified: the only reading that meets both adopted requirements.
- **D2 — the guard's "carries `<run-id>`" rule exempts the command's own path.** The command spells
  the run id as `$(date -u +%Y%m%dT%H%M%SZ)-$$`, not `<run-id>`; the test accepts exactly that one
  path (byte-equal), nothing looser. The check walks every file under `claude/`, not just the five
  files PQ3 names — stricter, same intent.
- **D3 — the quoting check covers the heredoc line too**, because PQ2 names `cat > "<path>" <<'EOF'`
  as one of the commands that must quote.
- **D4 — no `<NNNN>-plan` label in `fkit-review`.** That skill has no plan pass; plan step 3 puts the
  label in `fkit-adversarial-review`, which does.
- **D5 — the "why a run id" sentence is worded per skill** (fkit-review: a task label repeats, a
  branch label puts all of `main` in one file; adversarial-review: its pass and the lead reviewer's
  can overlap; stateful: same Round, repeating clean round). The hazard line itself is identical in
  all three.
- **D6 — "create the dir if needed" is now carried by `mkdir -p` inside the command**, not prose.

No review fixes were applied (Build step only).

### Process review, round 1 (Process-review worker, spawned by `fkit-sprint-ship-loop`, 2026-10-15)

- **R2 — applied without asking (obvious winner within intent).** Finding: the guard test did not
  pin the PQ2 branch-label rule, so deleting it from a skill stayed green. Change: test-only —
  `test/adversarial-prompt-path.test.js` check 2 now also requires
  ``every character outside `A–Z a–z 0–9 . _ -` replaced by `-` `` in each of the three skills; one
  control arm (rule removed from `fkit-stateful-review` must fail); header item 2 says why. Why it
  qualified: verified `CORRECT`; localized to the plan's own guard test (plan Step 7); pins text PQ2
  adopted, changes no skill wording or behaviour. Proved red for the other two skills by hand.
- **R1 — not applied; returned NEEDS-DECISION.** The fix changes the heredoc delimiter the owner
  adopted word for word in PQ2, and more than one fix shape exists, so it is not an in-plan
  mechanical fix.
- **R1 — applied under an owner ruling, not autonomously.** Ruling, quoted: "Unique marker per run
  (Recommended)" — 2026-10-15, AskUserQuestion in the fkit-lead session; it amends PQ2's `<<'EOF'`
  wording. Change: `claude/skills/fkit-adversarial-review/SKILL.md` Primary mode item 2 — heredoc
  marker `FKIT_PROMPT_<run-id>` (open and close), path quoting unchanged; guard test check 6 plus two
  control arms; `.claude/` refreshed (`cmp` same). Proved in bash, zsh and sh that an inlined `EOF`
  line no longer ends the prompt.

### Process review, round 2 (Process-review worker, spawned by `fkit-sprint-ship-loop`, 2026-10-15)

- **R3 — applied under an owner ruling, not autonomously.** Ruling, quoted: "Fix it now in 0385
  (Recommended)" — 2026-10-15, AskUserQuestion in the fkit-lead session; it widens the approved plan
  to cover R3. Finding: `fkit-review` item 2 (reused by `fkit-stateful-review`) inlines untracked files
  but named no way to write the prompt, so a habitual `<<'EOF'` heredoc hits R1's failure. Change:
  one sentence in `claude/skills/fkit-review/SKILL.md` Step 1B item 2 (Write tool, or the
  `FKIT_PROMPT_<run-id>` marker, never a fixed one, and why); `fkit-stateful-review` inherits it via
  "Exactly as in fkit-review Step 1", so no edit there; guard test check 6 assertion plus one control
  arm; `.claude/` refreshed (`cmp` same). No obvious-winner calls this round.

## Flagged, not edited

- Stale, owner = architect: `ai-agents/knowledge-base/architecture.md` (the review procedure and
  Codex run descriptions), ADR-016 and ADR-042 (record what was true at decision time).
- Stale, owner = wiki (next sync): `wiki/systems/fkit.md`, `wiki/systems/review-and-model-diversity.md`.
- Knock-on for the producer: open briefs `0273` and `0287` cite line numbers in the changed run lines
  (as the plan said). Also found: `0138` cites a `fkit-review` line and a `fkit-stateful-review` line
  below the insertion points, and `0169` cites a `fkit-stateful-review` line below the insertion
  point; those lines moved. The Backlog board's rows for 0273/0287 and for this task carry the same
  kind of line cites. No dependency link either way.
