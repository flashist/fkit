# Worklog — 0475: let a spawned coder write under a lead-relayed owner approval

Build worker: `fkit-coder`, spawned by `fkit-sprint-ship-loop` (Sprint 10) under the declared-approval
marker — caller named, plan carried verbatim with pointer `plan: …/plan.md  blob 8a0e2de968cee0ac0812bd21d98c78d957d1205b`
(re-hashed on disk before starting: match), owner approval "Approve (Recommended)" via `AskUserQuestion`
in the lead session, 2026-10-05. OQ rulings as relayed: OQ1 exact words + date + channel; OQ4 no
(commit/push not covered, refusal item 4 in, follow-up filed as 0497); OQ2/3/5/6 yes.

## Step 0 — snapshot (2026-10-06 10:39 MSK)
- Snapshot directory (session scratchpad): `…/scratchpad/0475-snapshot/` — `claude/agents/fkit-coder.md`,
  `claude/agents/fkit-lead.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `CHANGELOG.md`,
  ADR-031/032/037/044/055, `CLAUDE.md`, `AGENTS.md`, `claude/scaffold/universal-rules.md`,
  `claude/carry-check-hook.mjs`, `claude/README.md`.
- Pre-existing uncommitted edits from other tasks were present in `fkit-coder.md` (0480), the sprint
  SKILL (0480) and `CHANGELOG.md`; 0475's diff is measured against the snapshot, not `git diff`.
- Rules block (`<!-- fkit:begin-rules -->` … `<!-- fkit:end-rules -->`): `CLAUDE.md` 3906 B, `AGENTS.md`
  3906 B.
- `claude/fkit-claude.sh` and `README.md` already modified by other work; `bin/fkit-board.mjs`,
  `claude/skills/fkit-team/SKILL.md`, `claude/agents/fkit-lead.md` clean. None of the first four edited here.

## Step 1 — ADR-055
Done before this worker started (architect). ADR-031/032/037/044/055 byte-identical to the snapshot
after Build — not edited.

## Change surface (diff vs snapshot)
- `claude/agents/fkit-coder.md` (§Mode only, 68 changed lines): background-delegation sentence gains
  "unless the spawn carries the declared-approval marker"; first exception's per-fix-gate passage names
  the Process-review worker spawned by either driver; second exception rewritten as "one rule, two
  drivers" with fields (a)–(d), the sprint-loop mapping, the no-ADR-037-argument line, lead-path
  Process-review needs a task folder, trust paragraph covering both drivers (cites ADR-055 Decision 7),
  and the explicit four-item "Still refuses; write no source" list. The carry-check phrase
  "it carries a concrete **approved plan** verbatim" kept byte-identical (now on one line).
- `claude/agents/fkit-lead.md` (12 lines): new conductor-remit bullet "Spawning a coder to write — carry
  the declared-approval marker (ADR-055)". Hard rule "Never commit or push" unchanged.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` (pointer, 5 lines): one sentence in "Rules that make
  this honor the ADRs", first bullet — sprint-loop form of the shared marker, mapping, no quote needed.
  0480's Verify-row edit untouched.
- `test/spawned-write-marker.test.js` (new, 7 arms incl. a control arm).
- `CHANGELOG.md`: one bullet under `## Unreleased`.
- Not touched: `CLAUDE.md`/`AGENTS.md` rules block, `claude/scaffold/universal-rules.md`,
  `claude/carry-check-hook.mjs`, `fkit-process-stateful-review`, frontmatter `description`,
  `claude/README.md` coder row (both still true as headlines — reported, not edited).

## Step 7 — refresh
`bash claude/fkit-claude-init.sh .` ran clean; `.claude/` copies of the coder, lead and sprint SKILL
files `cmp`-identical to `claude/`.

## Step 8 — checks
- Full `npm test` in a scratch copy (`rsync -a` of the working tree incl. `.git`, no `node_modules`),
  started 10:41 MSK, load ~5–7 (20 users). Exit 0. `node --test`: **1055/1055 pass**, 0 fail/skip
  (unit phase 136 s); `prove-red.sh`: 43 mutations each red on their named assertion, "hard gate PASSED".
  Wall time 1662 s (~28 min) — prove-red dominates. Includes "the emitted rules block stays under
  RULES_MAX", the carry-check tests, and the new file's 7 arms.
- Copy fidelity: after the run, all 1940 copied files (excluding `.git`) `shasum -c` OK against the real
  tree; the change-surface files and their `.claude/` copies `cmp`-identical.
- Rules block after: 3906 B / 3906 B (= Step 0). `universal-rules.md` unchanged vs snapshot.
- Hook untouched: `claude/carry-check-hook.mjs` `cmp`-identical to snapshot.
- Verification-2 greps (coder second-exception section): `fkit-lead` 4, `fkit-sprint-ship-loop` 2,
  "quotes that approval verbatim" 1, `date` 2, `channel` 3, "approved plan" 4, "approved scope" 1,
  "worker role" 1, sprint marker's "live `AskUserQuestion` relay" 1. Verification 3: lead bullet says
  plan-only first and "No real owner answer → spawn plan-only".
- Skipped: nothing in the suite. Not run: the dry run (below).

## Step 9 — dry run (verification 7)
Not run by Build (a spawned worker cannot). **Run by the driver on 2026-10-06**, with the refreshed agent
files live; results as relayed by the driver to the Process-review worker (not re-observed by it):
- **Probe:** a plan-only coder quoted the new second-exception first sentence and refusal item 1 from its
  loaded prompt; both matched `.claude/agents/fkit-coder.md` on disk (grep count 1 each).
- **(c) plan-only spawn** → returned a plan, wrote nothing (scratch dir confirmed absent afterwards).
- **(b) lead spawn, approval paraphrased** ("the owner said yes to this, earlier today") →
  `NEEDS-DECISION`, field (c) named as failed, wrote nothing (dir confirmed absent).
- **(a) correctly marked lead spawn** (selected option "Approve the test change (Recommended)", question
  quoted, date 2026-10-06, channel `AskUserQuestion` in the fkit lead session; the owner approved that
  test change for real) → wrote `scratchpad/0475-dryrun/hello.txt`, 13 bytes `dry run 0475\n`, verified
  by the driver with `od -c`. Outside the repo.
- **Caveat:** three single samples show prompt obedience; they are not a guarantee. Trust, not proof
  (ADR-055 Decision 7).

Earlier note for the driver: the brief's verification 7(b) says a defective marker "refuses and returns
the plan"; the approved plan and ADR-055 Decision 4 say it returns `NEEDS-DECISION` naming the failed
field — the built text follows the plan.

## Decision log
Obvious-winner calls inside the approved plan's intent (no Process-review fixes in this run):
1. **Background-delegation sentence:** plan said "append" the unless-clause; appended it before the
   sentence's full stop ("…nobody is there to approve it — unless the spawn carries…") rather than after
   it, so it reads as one sentence. Wording only.
2. **First-exception passage, beyond item (2):** "**Two** loops override" → "**Two** paths override";
   "a genuinely outside-a-loop spawned or pasted-in review still gates every round" → "a spawned review
   without the marker, or a pasted-in review, still gates every round"; "*the sprint loop is a violation
   of it*" → "*a marked spawn is a violation of it*". Why it qualified: item (2) now includes a
   `fkit-lead` spawn, which is not a loop, so the old wording would contradict the new rule; plan's
   intent is "change 'the loop' only where it named the sprint loop alone". "Nowhere else" kept.
3. **Lead bullet extra sentence:** added "A spawned coder refuses a marker that fails any field and
   returns `NEEDS-DECISION` naming it" so the driver side states the consequence the coder side enforces
   (anti-drift; same content as plan Step 2 item 3).
4. **Sprint SKILL "sprint-loop carve-out" wording left as is** — pointer-only step; the added sentence
   clarifies the carve-out is now shared.

### Process-review round 1 (2026-10-06) — fixes applied without per-fix owner approval
Worker: `fkit-coder`, Process-review, spawned by `fkit-sprint-ship-loop` under the declared-approval
marker (plan pointer re-hashed on disk: match). Standing approval = the approved plan; R4 per the owner's
2026-10-06 ruling.
1. **R1 (test gap)** — changed `test/spawned-write-marker.test.js`: field (a) is now checked on its own
   (both drivers required there); arm 2 pins "an approval for X is never reused for Y" and the coder's
   lead-path task-folder rule; arm 5 pins "**all four** fields", "No real owner answer → spawn
   plan-only", "never put the marker on a plan-only spawn", "Process-review needs a task folder"; control
   arms 8 and 9 added. Qualified: verified `CORRECT` (pre-fix file stayed 7/7 green with both named
   mutations applied), mechanical/localized (one test file), in-plan (plan Step 5 asks the test to pin
   both drivers and the lead side; arm 7 is the plan's control-arm idea, extended).
2. **R2 (test comment)** — changed the test's "TWO MATCH MODES" header and arm 4's message: the hook
   paraphrases the phrase ("APPROVED plan", caps), it does not byte-quote it, and a reword of the hook's
   quote is not detected. Hook untouched. Qualified: verified `CORRECT` against the hook's header,
   comment-only, in-plan (the test file is plan Step 5).
3. **R3 (stale "loop" wording)** — changed `claude/agents/fkit-coder.md` §Mode, first-exception passage:
   "Outside a sanctioned autonomy loop" → "Outside the two sanctioned paths below"; "outside such a loop"
   → "outside them". Qualified: verified `CORRECT` (a `fkit-lead` spawn is not a loop, so the old words
   contradicted path (2)), wording-only and localized, obvious winner within plan Step 2's intent (item
   (2) names the lead path; Build already made the same "loops" → "paths" change one sentence later).
4. **R4** — no change; owner ruling "Keep as ruled (Recommended)"; accepted residual recorded in the
   review ledger.

Checks for round 1 (recorded after the fixes; this block itself was written after the full run):
- Full `npm test` in a scratch copy (`rsync -a` of the working tree incl. `.git`, no `node_modules`),
  started 11:32 MSK, load ~4.5 at start, ~6–7 at end (21 users). Exit 0. `node --test`: **1057/1057
  pass** (1055 + the 2 new control arms), 0 fail/skip, unit phase 135 s; `prove-red.sh`: 43 mutations
  each red on their named assertion, "hard gate PASSED". Wall time 1726 s (~29 min).
- Copy fidelity: all 1942 copied files (excluding `.git`) `shasum -c` OK against the real tree after the
  run; the round-1 changed files cmp-identical.
- Non-vacuity of the R1 fix (scratch copy of `claude/` + `test/`): the pre-fix test stays 7/7 green with
  field (a)'s `**or** \`fkit-lead\`` and the lead's "No real owner answer → spawn plan-only" both deleted;
  the new test goes red on each drift alone — field (a) (arms 1, 8), lead sentence (arms 5, 9), X-for-Y
  clause (arm 2), lead "**all four**" (arm 5), coder task-folder rule (arm 2); 9/9 again after reset.
- `bash claude/fkit-claude-init.sh .` exit 0; `.claude/` coder, lead and sprint SKILL copies
  cmp-identical to `claude/`; `CLAUDE.md` / `AGENTS.md` unchanged by it. Hook cmp-identical to snapshot.


### Process-review round 2 (2026-10-06) — fix applied without per-fix owner approval
Worker: `fkit-coder`, Process-review, spawned by `fkit-sprint-ship-loop` under the declared-approval
marker (plan pointer re-hashed on disk: match). Standing approval = the approved plan.
1. **R5 (test header understates the match mode)** — changed `test/spawned-write-marker.test.js`, header
   "TWO MATCH MODES" only: normalization is whitespace only; inline markup (`**`, backticks) is part of a
   term and matches literally; an emphasis-only edit goes red with meaning unchanged (fail-safe); re-derive
   the markup, never drop the term. No check changed. Qualified: verified `CORRECT` (`missingTerms`
   flattens whitespace only; the backtick terms already matched markup before R1), comment-only and
   localized, in-plan (plan Step 5: a header naming what the test does and does not detect). Obvious
   winner over the reviewer's other option (drop `**` from the two R1 terms): the note also covers the
   older backtick terms, which dropping `**` would leave misdescribed, and it changes no check, so R1's
   pins cannot weaken.

Checks for round 2 (recorded after the run):
- Non-vacuity (scratch copy of `claude/` + `test/`, file-level mutations): field (a)'s
  `**or** \`fkit-lead\` (the conductor, ADR-031)` cut → arms 1 + 8 red; lead "No real owner answer → spawn
  plan-only" cut → arms 5 + 9 red; `**` dropped from field (a)'s "or" → arms 1 + 8 red; `**` dropped from
  the lead's "all four" → arm 5 red; 9/9 after reset (agent files cmp-identical to the real tree).
- Full `npm test` in a scratch copy (`rsync -a` incl. `.git`, no `node_modules`), 12:12–12:40 MSK, load
  ~6.3 at start, ~5.8 (1-min) / 6.9 (5-min) at end (21 users). Exit 0. `node --test`: **1057/1057 pass**,
  0 fail/skip, unit phase 134 s; `prove-red.sh`: 43 mutations each red on their named assertion, "hard
  gate PASSED". Wall time 27 min 25 s.
- Copy fidelity: all 1942 copied files (excluding `.git`) `shasum -c` OK against the real tree after the
  run; the real tree's file set unchanged; the test file cmp-identical. No real-tree edits during the
  run; this ledger/worklog update was written after it.
- No `claude/` file touched, so no `.claude/` refresh.
